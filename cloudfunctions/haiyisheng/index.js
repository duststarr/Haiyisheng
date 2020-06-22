// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command
let wxContext
let db_order
let db_user
let db_payment
let db_oldclient
const actions = {}
// 云函数入口函数
exports.main = async (event, context) => {
  wxContext = cloud.getWXContext() // 必须在main函数里执行，操
  db_order = db.collection('order')
  db_user = db.collection('user')
  db_payment = db.collection('payment')
  db_oldclient = db.collection('oldclient')
  if (event.action && actions.hasOwnProperty(event.action)) {
    console.log("" + event.action, event)
    console.log("openid", wxContext.OPENID)
    try {
      const res = await actions[event.action](event, context);
      return res
    } catch (e) {
      console.error('function error', e)
    }
    return false
  }
  console.log('action not find', event)
  return {
    error: 'action not find:' + event.action
  }
}

/**
 * 小程序启动时鉴权
 * 
 * @param query
 */
actions.authentication = async (event) => {
  const query = event.query
  let referrerID = null;
  // 数据库中是否有此用户
  const res = await db_user.where({
    _openid: wxContext.OPENID
  }).get();
  if (res.data.length > 0) {
    const result = res.data[0]
    // 如果有推广人，且当前用户没有推广人，更新之
    if ('marketing' == query.action && !result.referrerID) {
      referrerID = query.openid
      await db_user.doc(result._id).update({
        data: {
          referrerID
        }
      })
    }
    // 水质
    const r = Math.random()
    if (r < 0.1) { // 启动时有10%概率变更水质
      let q1 = result.quality1 || 50 // 矿物初始50
      let q2 = result.quality2 || 10 // 纯净初始10
      q1 += parseInt(Math.random() * 8 - 4) // 矿物 -4 ~ +4 变动
      if (q1 < 40) q1 = 40 // 不小于40
      if (q1 > 60) q1 = 60 // 不大于60
      q2 += parseInt(Math.random() * 6 - 3) // 纯净 -3 ~ +3 变动
      if (q2 < 4) q2 = 4 // 不小于5
      if (q2 > 10) q2 = 10 // 不大于15
      await db_user.doc(result._id).update({
        data: {
          quality1: q1,
          quality2: q2
        }
      })
    }
  } else { // 新人        
    referrerID = 'marketing' == query.action ? query.openid : null // 推荐人的openid
    const detail = {
      _id: wxContext.OPENID,
      _openid: wxContext.OPENID,
      timeBeUser: new Date(),
      referrerID,
      isAdmin: false,
      isWorker: false,
      isClient: false
    }

    await db_user.add({
      data: detail
    })
    // 生成二维码
    try {
      actions.generateQRcode()
    } catch (e) {
      console.error('new user qrcode error', e)
    }
  }
  // 推荐人粉丝+1
  if (referrerID) {
    db_user.doc(referrerID).update({
      data: {
        fans: _.inc(1)
      }
    })
  }
  return wxContext.OPENID
}
/**=============
 * order
 * 
 * type: install,move,recycle,replace,repair
 * type: 新装，移机，拆机，换芯，报修
 * state: created,dispatched,accepted,completed,done
 * state: 新订单，待接单，待执行，待确认，已完成，已取消
 * done: true,false //完成标志
 */


/**
 * 建立订单，用户填写联系方式即【预约安装】
 * @param address 用户联系方式
 */
actions.orderCreate = async (event, context) => {
  const type = event.type || '新装'
  const address = event.address
  const addr2 = event.addr2
  const message = event.message
  const filters = event.filters // 需要更换的滤芯

  const res = await db_order.add({
    data: {
      _openid: wxContext.OPENID,
      type,
      address,
      name: address.userName,
      phone: address.telNumber,
      addr2,
      message,
      filters,
      createTime: new Date(),
      state: '新订单'
    }
  })
  return res;
}
/**
 * 用户获取本人【预约安装】订单的信息
 * @return 数据库get的结果
 */
actions.orderGetCreating = async (event, context) => {
  const res = await db_order.where({
    _openid: wxContext.OPENID,
    type: '新装',
    state: _.neq('已取消')
  }).get()
  return res.data;
}
/**
 * 用户本人取消订单
 * @param orderID
 */
actions.orderCancel = async (event, context) => {
  const orderID = event.orderID
  const res = await db_order.doc(orderID).update({
    data: {
      state: '已取消'
    }
  })
  return res;
}

/**
 * 查询订单
 * @param type
 * @param state
 * @param isWorker
 */
actions.orderGetList = async (event, context) => {
  const param = {}
  if (event.type)
    param.type = event.type
  if (event.states)
    param.state = _.in(event.states)
  if (event.isWorker) {
    param.worker = {}
    param.worker.openid = wxContext.OPENID
  }
  if (event.isClient) {
    param._openid = wxContext.OPENID
    param.type = _.neq('新装')
    param.state = _.in(['新订单', '待接单', '待执行', '待确认'])
  }
  const res = await db_order.where(param).orderBy('createTime', 'desc').get()
  return res.data;
}

/**
 * 
 */
actions.orderDispatchWorker = async (event) => {
  const orderID = event.orderID
  const worker = event.worker
  await db_order.doc(orderID).update({
    data: {
      worker: worker,
      state: '待接单'
    }
  })
  return true
}
/**
 * 
 */
actions.orderStateChange = async (event) => {
  const stateNew = event.stateNew
  const operator = event.operator || wxContext.OPENID
  const orderID = event.orderID

  await db_order.doc(orderID).update({
    data: {
      state: stateNew,
      stateTime: new Date(),
      stateChangeBy: operator
    }
  })
  return true
}
/**
 * 客服接单
 */
actions.orderPick = async (event) => {
  const orderID = event.orderID
  const operator = event.operator || wxContext.OPENID
  await db_order.doc(orderID).update({
    data: {
      state: '待执行',
      stateTime: new Date(),
      stateChangeBy: operator,
      timePick: new Date()
    }
  })
  return true
}
/**
 * 客服完成工作
 */
actions.orderWorkdone = async (event) => {
  const orderID = event.orderID
  const operator = event.operator || wxContext.OPENID
  await db_order.doc(orderID).update({
    data: {
      state: '待确认',
      stateTime: new Date(),
      stateChangeBy: operator,
      timeWorkdone: new Date()
    }
  })
  return true
}
/**
 * 客户确认服务完成
 */
actions.orderConfirm = async (event) => {
  const orderID = event.orderID
  const type = event.type
  const filters = event.filters
  const addr2 = event.addr2 || null

  const operator = event.operator || wxContext.OPENID
  const today = new Date()
  await db_order.doc(orderID).update({
    data: {
      state: '已完成',
      stateTime: today,
      stateChangeBy: operator,
      timeConfirm: today
    }
  })

  const openid = wxContext.OPENID
  if ('换芯' == type) {
    if (filters.includes('1')) {
      await db_user.doc(openid).update({
        data: {
          "filters.first": today
        }
      })
    }
    if (filters.includes('2')) {
      await db_user.doc(openid).update({
        data: {
          "filters.second": today
        }
      })
    }
    if (filters.includes('3')) {
      await db_user.doc(openid).update({
        data: {
          "filters.third": today
        }
      })
    }
  } else if ('拆机' == type) {
    await db_user.doc(openid).update({
      data: {
        isClient: false,
        timeChaiji: today
      }
    })
  } else if ('移机' == type) {
    await db_user.doc(openid).update({
      data: {
        address: addr2
      }
    })
  }


  return true;
}
/**
 * @param needCountOrders bool 是否统计客服的订单情况
 */
actions.workerGetList = async (event) => {
  const res = await db_user.where({
    isWorker: true
  })
    .field({
      name: true,
      phone: true,
      avatar: true,
      _openid: true,
      workerFromWho: true
    })
    .get()
  if (event.needCountOrders) {
    const result = await Promise.all(res.data.map(async (worker) => {
      const num1 = await db_order.where({
        worker: {
          id: worker._id
        },
        type: '新装',
        state: '已完成'
      }).count()
      worker.numInstallDone = num1.total
      const num2 = await db_order.where({
        worker: {
          id: worker._id
        },
        type: _.neq('新装'),
        state: '已完成'
      }).count()
      worker.numAftersaleDone = num2.total
      return worker
    }))
    return result
  }
  return res.data
}
// /**
//  * count worker's tasks
//  */
// actions.ordersCountByWorker = async (event) => {
//   var result = {}
//   const res = await db_order.where({
//     worker: _.exists(true)
//   }).get()
//   console.log(res)
//   if (!res.data || res.data.length == 0)
//     return false
//   res.data.forEach(order => {
//     const key = order.worker.id
//     if (!result.hasOwnProperty(key)) {
//       result[key] = {
//         numInstall: 0,
//         numAftersale: 0,
//         numInstallDone: 0,
//         numAftersaleDone: 0
//       }
//     }
//     if ('新装' == order.type) {
//       result[key].numInstall++
//       if ('已完成' == order.state) {
//         result[key].numInstallDone++
//       }
//     } else {
//       result[key].numAftersale++
//       if ('已完成' == order.state) {
//         result[key].numAftersaleDone++
//       }
//     }
//   })
//   return result;
// }

/**
 * 删除客服
 */
actions.workerDelete = async (event) => {
  const openid = event.openid
  db_user.doc(openid).update({
    data: {
      isWorker: false
    }
  })
  return true;
}

actions.clientGetList = async (event) => {
  const res = await db_user.where({
    isClient: true
  }).get()
  return res.data
}

/**
 * 模拟充值
 */
actions.orderPayTest = async (event) => {
  const orderID = event.orderID
  const amount = event.amount
  const message = event.message
  const referrerID = event.referrerID || null
  const days = event.days
  const address = event.address;
  const outTradeNo = event.outTradeNo
  const nonceStr = event.nonceStr

  const timePay = new Date()
  // 更新order记录
  await db_order.doc(orderID).update({
    data: {
      timePay,
      payment: {
        orderID,
        amount,
        days,
        message,
        timePay,
        openid: wxContext.OPENID,
        outTradeNo,
        nonceStr
      }
    }
  })
  await actions.orderStateChange({
    orderID,
    stateNew: '已完成'
  })

  // 更新user表
  await db.collection('user').doc(wxContext.OPENID).update({
    data: {
      isClient: true,
      serviceStart: timePay,
      serviceDays: days,
      filters: {
        first: timePay,
        second: timePay,
        third: timePay
      },
      address: address
    }
  })
  // 计算推广奖励
  // 推广分新人,和续费,这里是新人首次充值
  if (referrerID) {
    await db_user.doc(referrerID).update({
      data: {
        vouchers: _.inc(1) //代金券+1
      }
    })
  }
  return true
}
/**
 * 续费
 */
actions.recharge = async (event) => {
  const referrerID = event.referrerID
  const amount = event.amount
  const days = event.days
  const name = event.name
  const phone = event.phone
  const message = event.message
  const outTradeNo = event.outTradeNo
  const nonceStr = event.nonceStr
  const vouchers = event.vouchers || 0

  const res = await db_payment.add({
    data: {
      _openid: wxContext.OPENID,
      referrerID,
      amount,
      days,
      name,
      phone,
      message,
      timePay: new Date(),
      outTradeNo,
      nonceStr,
      vouchers
    }
  })
  await db_user.doc(wxContext.OPENID).update({
    data: {
      serviceDays: _.inc(days),
      voucherUsed: _.inc(vouchers)
    }
  })

  return res
}

/**
 * 二维码
 */
actions.generateQRcode = async (event) => {
  const query = 'pages/home/home?action=marketing&openid=' + wxContext.OPENID
  const result = await cloud.openapi.wxacode.get({
    path: query
  })
  const file = await cloud.uploadFile({
    cloudPath: wxContext.OPENID + '.jpg',
    fileContent: result.buffer,
  })
  await db_user.doc(wxContext.OPENID).update({
    data: {
      qrcode: file.fileID
    }
  })
  return file.fileID
}
/**
 * 获取我的推广下线列表
 */
actions.getFirends = async (event) => {
  const res = await db_user.where({
    isClient: true,
    referrerID: wxContext.OPENID
  }).get()
  const users = res.data
  const result = users.map(user => {
    const firstDate = new Date();
    const secondDate = new Date(user.serviceStart);
    const diff = Math.abs(firstDate.getTime() - secondDate.getTime())
    const past = parseInt(diff / (1000 * 60 * 60 * 24));
    const inservice = past < user.serviceDays
    return {
      name: user.address.userName,
      phone: user.address.telNumber,
      avatar: user.avatar,
      date: user.serviceStart,
      inservice
    }
  })
  return result
}

/**
 * 会员现金收益计算
 */
actions.clientProfit = async (event) => {
  const res = await db_payment.where({
    amount: _.gt(0),
    referrerID: wxContext.OPENID
  }).get()
  return res.data
}

/** 
 * 登记修改客户已提取的收益值
 * @param {*} event 
 */
actions.setProfitUsed = async (event) => {
  const openid = event.openid;
  const used = event.profitUsed;
  await db_user.doc(openid).update({
    data: {
      profitUsed: used
    }
  })
  return true
}

/**
 * 管理员获取老会员请求
 */
actions.getOldclientRequests = async (event) => {
  const res = await db_oldclient.where({
    done: false
  }).get()
  return res.data
}
/**
 * 管理员接受老会员申请
 */
actions.acceptOldclient = async (event) => {
  const openid = event._openid;
  const address = event.address;
  const serviceYears = event.serviceYears;
  const date0 = event.date0;
  const date1 = event.date1;
  const date2 = event.date2;
  const date3 = event.date3;

  const serviceDays = (parseInt(serviceYears) + 1) * 365
  const data = {
    address,
    serviceDays,
    serviceStart: date0,
    filters: {
      first: date1,
      second: date2,
      third: date3
    },
    isClient: true,
    isOldclient: true
  }
  console.log(data)
  await db_user.doc(openid).update({
    data
  })
  oldclientDo(event._id, 'accept')

  return true
}
/**
 * 管理员拒绝老会员申请
 */
actions.rejectOldclient = async (event) => {
  oldclientDo(event._id, 'reject')
  return true
}
async function oldclientDo(id, result) {
  await db_oldclient.doc(id).update({
    data: {
      done: true,
      result,
      admin: wxContext.OPENID,
      timeDone: new Date()
    }
  })
}

/**
 * 标记删除会员
 * 因为涉及推广、充值记录等一系列数据关联，这只是标记删除，并不会实际删除
 */
actions.deleteClient = async (event) => {
  const openid = event.openid

  await db_user.doc(openid).update({
    data:{
      isClient : false
    }
  })
  return true
}