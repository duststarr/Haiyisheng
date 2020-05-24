// miniprogram/pages/payment/payment.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    policies: [
      { content: '充值一年365天，730元', days: 365, amount: 730 },
      { content: '充值二年730天，1400元', days: 730, amount: 1400 },
      { content: '充值三年1095天，2000元', days: 1095, amount: 2000 },
      { content: '充值四年1460天，2600元', days: 1460, amount: 2600 },
      { content: '充值五年1825天，3100元；到期后产权归客户', days: 1825, amount: 3100 },
    ],
    orderID: null
  },
  async pay(e) {
    console.log(e)
    const pos = e.currentTarget.dataset.pos
    const policy = this.data.policies[pos]
    const res = await app.wxcloud('orderPayTest', {
      orderID: this.data.orderID,
      amount: policy.amount,
      message: policy.content
    })

    const db = wx.cloud.database();
    var today = new Date()
    await db.collection('user').doc(app.globalData.userDetail._id).update({
      data: {
        isClient: true,
        serviceStart: today,
        serviceDays: policy.days,
        filters: {
          first: today,
          second: today,
          third: today
        }
      }
    })
    app.globalData.userDetail.isClient = true

    wx.showToast({
      title: policy.content,
      icon: 'none',
      duration: 2000,
      success: () => {
        setTimeout(wx.navigateBack, 2000)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      orderID: options.orderID
    })
  },

})