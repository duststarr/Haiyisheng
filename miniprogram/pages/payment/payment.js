// miniprogram/pages/payment/payment.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    policies: [
      { content: '充值一年365天，730元（平均2元/天）', days: 365, amount: 730 },
      { content: '充值两年730天，1388元（平均1.9元/天）', days: 730, amount: 1388 },
      { content: '充值三年1095天，1971元（平均1.8元/天）', days: 1095, amount: 1971 },
      { content: '充值四年1460天，2482元（平均1.7元/天）', days: 1460, amount: 2482 },
      { content: "充值五年1825天，2737元（平均1.5元/天）\n机器所有权、产权归客户", days: 1825, amount: 2737 },
    ],
    orderID: null
  },
  async pay(e) {
    const pos = e.currentTarget.dataset.pos
    const policy = this.data.policies[pos]
    const user = app.globalData.userDetail

    const paydata = await app.paycloud(policy.content, policy.amount);

    try {
      const res = await app.wxcloud('orderPayTest', {
        orderID: this.data.orderID,
        amount: policy.amount,
        days: policy.days,
        message: policy.content,
        referrerID: user.referrerID || null,
        address: app.globalData.address,
        outTradeNo: paydata.outTradeNo,
        nonceStr: paydata.nonceStr
      })

      app.globalData.userDetail.isClient = true
      app.globalEmit('userDetail')
      wx.navigateBack({
        complete: (res) => {},
      })
    } catch (e) {
      console.error(e)
      wx.showModal({
        title: '发生错误',
        content: '支付成功但入账失败,请联系管理员'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderID: options.orderID
    })
  },

})