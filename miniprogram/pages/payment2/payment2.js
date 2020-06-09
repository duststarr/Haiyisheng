// miniprogram/pages/payment/payment.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    policies: [
      { content: '充值一年365天，730元', days: 365, amount: 730 },
      { content: '充值二年730天，1388元', days: 730, amount: 1388 }
    ],
    vouchersLeft: 0,
    show: false
  },
  hideModal: function () {
    this.setData({
      show: false
    })
  },
  onLoad: function (options) {
    const that = this

    app.globalWatch('userDetail', user => {
      const v = user.vouchers || 0
      const u = user.voucherUsed || 0
      that.setData({
        vouchersLeft: (v - u)
      })
    })
  },
  async pay(e) {
    const pos = e.currentTarget.dataset.pos
    const policy = this.data.policies[pos]

    this.payAction(policy)
  },
  async pay2(e) {
    if (this.data.vouchersLeft < 1) {
      wx.showToast({
        title: '对不起,您没有可用代金券!',
        icon: 'none',
        duration: 3000
      })
    } else {
      this.setData({
        show: true
      })
    }
  },
  onVoucherCheck(e) {
    const val = e.currentTarget.dataset.value
    const amount = 730 - 180 * val
    const policy = {
      amount,
      days: 365,
      message: '使用' + val + '张代金券,并充值'
    }
    this.payAction(policy)
  },
  async payAction(policy) {
    const param = {}
    const user = app.globalData.userDetail
    param.referrerID = user.referrerID
    param.amount = policy.amount
    param.days = policy.days
    param.message = policy.content
    param.name = user.address.userName
    param.phone = user.address.telNumber
    await app.wxcloud('recharge', param)

    app.globalData.userDetail.serviceDays += policy.days
    app.globalEmit('userDetail')

    wx.showToast({
      title: "服务天数增加：" + policy.days,
      icon: 'none',
      duration: 2000,
      success: () => {
        setTimeout(wx.navigateBack, 2000)
      }
    })
  }
})