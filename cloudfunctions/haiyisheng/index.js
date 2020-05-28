// 云函数入口文件
const cloud = require('wx-server-sdk')
var db
var wxContext
var _
var db_order
var db_user

const actions = {}
// 云函数入口函数
exports.main = async (event, context) => {
  cloud.init()
  db = cloud.database()
  _ = db.command
  wxContext = cloud.getWXContext() // 必须在main函数里执行，操
  db_order = db.collection('order')
  db_user = db.collection('user')

  if (event.action && actions.hasOwnProperty(event.action)) {
    console.log("" + event.action, event)
    console.log("openid", wxContext.OPENID)
    try {
      const res = await actions[event.action](event, context);
      console.log('return', res)
      return res
    } catch (e) {
      console.error('function error', e)
    }
    return false
  }
  console.log('action not find', event)
  return { error: 'action not find:' + event.action }
}

/**
 * 小程序启动时鉴权
 * 
 * @param query
 */
actions.authentication = async (event) => {
  const query = event.query
  var result = null;
  var referrerID = null;
  // 数据库中是否有此用户
  const res = await db_user.where({
    _openid: wxContext.OPENID
  }).get();
  if (res.data.length > 0) {
    result = res.data[0]
    // 如果有推广人，且当前用户没有推广人，更新之
    if ('marketing' == query.action && !result.referrerID) {
      referrerID = query.openid
      await db_user.doc(result._id).update({
        data: {
          referrerID
        }
      })
    }
  } else { // 新人        
    referrerID = 'marketing' == query.action ? query.openid : null// 推荐人的openid
    const detail = {
      _id: wxContext.OPENID,
      _openid: wxContext.OPENID,
      timeBeUser: new Date(),
      referrerID,
      fans: 0,
      coupons: 0,
      profits: 0,
      isAdmin: false,
      isWorker: false,
      isClient: false
    }
    await db_user.add({
      data: detail
    })
    result = detail
  }
  console.log('referrerID', referrerID)
  // 推荐人粉丝+1
  if (referrerID) {
    db_user.doc(referrerID).update({
      data: {
        fans: _.inc(1)
      }
    })
  }
  return result
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
  const db_order = db.collection('order');
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
  const db_order = db.collection('order')
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

  const db_order = db.collection('order')
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
  const db_order = db.collection('order')
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
  const db_order = db.collection('order')
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

  return true;
}
/**
 * 
 */
actions.workerGetList = async (event) => {
  const res = await db_user.where({
    isWorker: true
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
  const name = event.name
  const phone = event.phone

  const timePay = new Date()
  await db_order.doc(orderID).update({
    data: {
      timePay,
      payment: {
        orderID,
        amount,
        message,
        timePay,
        openid: wxContext.OPENID
      }
    }
  })
  await actions.orderStateChange({
    orderID,
    stateNew: '已完成'
  })
  // 计算推广奖励
  // 推广分新人,和续费,这里是新人首次充值
  if (referrerID) {
    const firend = {
      userID: wxContext.OPENID,
      amount,
      name,
      phone,
      date: timePay
    }
    db_user.doc(referrerID).update({
      data: {
        firends: _.push(firend)
      }
    })
  }
  return true
}

/**
 * 二维码
 */
actions.generateQRcode = async (event) => {
  const res = await db_user.where({
    _openid: wxContext.OPENID
  }).get();
  const user = res.data[0]
  if (user.qrcode) {
    return user.qrcode
  } else {
    const query = 'pages/home/home?action=marketing&openid=' + wxContext.OPENID
    try {
      const result = await cloud.openapi.wxacode.get({
        path: query
      })
      const file = await cloud.uploadFile({
        cloudPath: wxContext.OPENID + '.jpg',
        fileContent: result.buffer,
      })
      await db_user.doc(user._id).update({
        data: {
          qrcode: file
        }
      })
      return file
    } catch (err) {
      return err
    }
  }
}
