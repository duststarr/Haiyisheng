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
    app.globalData.userDetail.serviceDays += policy.days
    app.globalEmit('userDetail')
    const param = {}
    const user = app.globalData.userDetail
    param.referrerID = user.referrerID
    param.amount = policy.amount
    param.days = policy.days
    param.name = user.address.userName
    param.phone = user.address.telNumber
    param.message = policy.content
    await app.wxcloud('recharge',param)

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