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
  return { error: 'action not find:'+event.action }
}

/**=============
 * order
 * 
 * type: install,move,recycle,replace,repair
 * type: 新装，移机，拆机，换芯，报修
 * state: created,dispatched,accepted,completed,done
 * state: 新订单，待接单，待执行，待确认，已完成
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
    type: '新装'
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
  }).remove()

  return res;
}

actions.orderGet = async (event, context) => {
  const order = db.collection('order');
  const condition = {}
  if( event.type )
    condition.type = event.type
  if( event.state )
    condition.state = event.state
  const res = await order.where(condition).get()
  return res;
}