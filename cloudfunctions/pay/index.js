// 云函数代码
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const Mch_id = '1599808241'
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext() // 必须在main函数里执行，操

  console.log(event)
  console.log(wxContext.OPENID)
  const bodyMsg = event.bodyMsg;
  const totalFee = event.totalFee;
  const outTradeNo = event.outTradeNo;
  const nonceStr = event.nonceStr;

  const res = await cloud.cloudPay.unifiedOrder({
    "body": bodyMsg,
    "outTradeNo": outTradeNo,
    "subMchId": Mch_id,
    "totalFee": totalFee,
    "nonceStr": nonceStr,
    "envId": "hys-k9bhf",
    "functionName": "pay_cb",
    "tradeType": "JSAPI",
    "spbillCreateIp": "127.0.0.1"
  })
  return res
}