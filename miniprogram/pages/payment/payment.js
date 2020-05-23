// miniprogram/pages/payment/payment.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    policies: [
      { content: '充值一年365天，730元', amount: 730 },
      { content: '充值二年730天，1400元', amount: 1400 },
      { content: '充值三年1095天，2000元', amount: 2000 },
      { content: '充值四年1460天，2600元', amount: 2600 },
      { content: '充值五年1825天，3100元；到期后产权归客户', amount: 3100 },
    ],
    orderID: null
  },
  async pay(e) {
    console.log(e)
    const pos = e.currentTarget.dataset.pos
    const policy = this.data.policies[pos]
    const res = await app.wxcloud('orderPayTest',{
      orderID: this.data.orderID,
      amount: policy.amount,
      message: policy.content
    })
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})