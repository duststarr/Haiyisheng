// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const wxContext = cloud.getWXContext()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event);
  switch (event.action) {
    case 'setupOrder': {
      return setupOrder(event, context);
    }
    case 'userGetOrderInfo': {
      return userGetOrderInfo(event, context);
    }
    case 'cancelOrder': {
      return cancelOrder(event, context);
    }
    default: {
      return { error: 'action do not find.' }
    }
  }
}
async function setupOrder(event, context) {
  const order = db.collection('order');
  const res = await order.add({
    data: {
      userID: wxContext.OPENID,
      type: 'NEW_ORDER',
      address: event.address,
      createTime: new Date(),
      state: 'user created',
      done: false,
      logs:[
        {
          content:'已预约，稍后客服将与您约定上门安装时间。感谢您选择我们的产品。'
        }
      ]
    }
  })
  return res;
}
async function userGetOrderInfo(event, context) {
  const order = db.collection('order');
  const res = await order.where({
    userID: wxContext.OPENID,
    type: 'NEW_ORDER',
    done: false
  }).get()
  return res.data;
}
async function cancelOrder(event, content){
  const order = db.collection('order');
  const res = await order.where({
    userID: wxContext.OPENID,
    type: 'NEW_ORDER'
  }).update({
    data:{
      done: true,
      logs: _.push([{content:'用户撤销申请'}])
    }
  })

  return res;
}