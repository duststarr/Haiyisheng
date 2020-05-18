// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const wxContext = cloud.getWXContext()
const _ = db.command

const actions = {};

// 云函数入口函数
exports.main = async (event, context) => {
  if (event.action && actions.hasOwnProperty(event.action)) {
    return actions[event.action](event, context);
  }
  return { error: 'action do not find.' }
}
actions.setupOrder = async (event, context) => {
  const order = db.collection('order');
  const res = await order.add({
    data: {
      userID: wxContext.OPENID,
      type: 'NEW_ORDER',
      address: event.address,
      createTime: new Date(),
      state: 'user created',
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
actions.userGetOrderInfo = async (event, context) => {
  const order = db.collection('order');
  const res = await order.where({
    userID: wxContext.OPENID,
    type: 'NEW_ORDER',
    done: false
  }).get()
  console.log('userGetOrderInfo', res)
  return res.data;
}
actions.cancelOrder = async (event, context) => {
  const order = db.collection('order');
  const res = await order.where({
    userID: wxContext.OPENID,
    type: 'NEW_ORDER'
  }).update({
    data: {
      done: true,
      logs: _.push([{ content: '用户撤销申请' }])
    }
  })

  return res;
}