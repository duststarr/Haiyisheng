// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const wxContext = cloud.getWXContext()
const _ = db.command

const actions = {
  // ,
  // ,
  // ,
  // orderDispatch,
  // orderAccept,
  // orderSuccess,
  // orderRecharge,
  // orderDone,
}
// 云函数入口函数
exports.main = async (event, context) => {
  if (event.action && actions.hasOwnProperty(event.action)) {
    return actions[event.action](event, context);
  }
  return { error: 'action not find:' + event.action }
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
  const order = db.collection('order');
  const res = await order.add({
    data: {
      userID: wxContext.OPENID,
      type: '新装',
      address: event.address,
      createTime: new Date(),
      state: '新订单',
      done: false,
      logs: [
        {
          content: '已预约，稍后客服将与您约定上门安装时间。感谢您选择我们的产品。'
        }
      ]
    }
  })
  return res;
}
/**
 * 用户获取本人【预约安装】订单的信息
 * @return 数据库get的结果
 */
actions.orderGetCreating = async (event, context) => {
  const order = db.collection('order');
  const res = await order.where({
    userID: wxContext.OPENID,
    type: '新装',
    done: false
  }).get()
  console.log('orderGetCreating', res)
  return res.data;
}
/**
 * 用户本人取消订单
 */
actions.orderCancel = async (event, context) => {
  const order = db.collection('order');
  const res = await order.where({
    userID: wxContext.OPENID,
    type: '新装'
  }).update({
    data: {
      done: true,
      state: '已取消'
    }
  })

  return res;
}

/**
 * 查询订单
 * @param type
 * @param state
 */
actions.orderGetList = async (event, context) => {
  const order = db.collection('order');
  const param = {}
  if (event.type)
    param.type = event.type
  if (event.states)
    param.state = _.in(event.states)
  console.log('param', event.states)
  const res = await order.where(param).get()
  return res.data;
}
/**
 * 
 */
actions.orderDispatchWorker = async (event) => {
  const orderID = event.orderID
  const worker = event.worker
  const order = db.collection('order')
  order.doc(orderID).update({
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
actions.workerGetList = async (event) => {
  const user = db.collection('user');
  const res = await user.where({
    isWorker: true
  }).get()
  return res.data
}