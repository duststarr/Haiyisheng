// miniprogram/pages/payment/payment.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    policies: [
      { content: '充值一年365天，730元', days: 365, amount: 730 },
      { content: '充值二年730天，1400元', days: 730, amount: 1400 }
    ]
  },
  async pay(e) {
    console.log(e)
    const pos = e.currentTarget.dataset.pos
    const policy = this.data.policies[pos]

    const db = wx.cloud.database();
    const _ = db.command;
    var today = new Date()
    await db.collection('user').doc(app.globalData.userDetail._id).update({
      data: {
        serviceDays: _.inc(policy.days)
      }
    })

    wx.showToast({
      title: "服务天数增加："+policy.days,
      icon: 'none',
      duration: 2000,
      success: () => {
        setTimeout(wx.navigateBack, 2000)
      }
    })
  },
})