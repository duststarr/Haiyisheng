// 云函数代码
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const Mch_id = '1599808241'
exports.main = async (event, context) => {
  const bodyMsg = event.bodyMsg;
  const totalFee = event.totalFee;
  const outTradeNo = event.outTradeNo;
  const nonceStr = event.nonceStr;

  const res = await cloud.cloudPay.unifiedOrder({
    "body" : bodyMsg,
    "outTradeNo" : outTradeNo,
    "subMchId" : Mch_id,
    "totalFee" : totalFee,
    "nonceStr": nonceStr,
    "envId": "hys",
    "functionName": "pay_cb",
    "tradeType":"JSAPI",
    "spbillCreateIp" : "127.0.0.1"
  })
  return res
}