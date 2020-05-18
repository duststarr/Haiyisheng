// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const wxContext = cloud.getWXContext()

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
      addr1: event.address,
      createTime: new Date(),
      state: 'user created',
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
    type: 'NEW_ORDER'
  }).get()
  return res.data;
}