// miniprogram/pages/admin/client/client.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    client: null,
    vouchers: null,
    voucherUsed: 0,
    profit: null,
    profitUsed: 0,
    showEditProfit: false
  },
  onCalcVouchers: function (e) {
    const that = this
    app.wxcloud('getFirends').then(res => {
      that.setData({
        vouchers: res.result.length
      })
    })
  },
  onCalcProfit: function (e) {
    //我的现金收益
    // @result 我的下线的续费充值情况
    app.wxcloud('clientProfit').then(res => {
      const that = this
      let profit = 0
      res.result.forEach(payment => {
        const my = (payment.amount * 0.1)
        profit += my
      })
      this.setData({
        profit
      })
    })
  },
  onEditProfitUsed: function (e) {
    this.setData({
      showEditProfit: true
    })
  },
  onEditComfirm: function (e) {
    console.log(e)
    const v = parseInt(e.detail.value)
    console.log(v)

    if(!v){
      wx.showToast({
        title:"只能输入数字",
        icon:'none'
      })
      return;
    }
    const that = this;
    const param = {}
    param.openid = app.globalData.curClient._openid
    param.profitUsed = v;
    app.wxcloud('setProfitUsed', param).then(res => {
      that.setData({
        showEditProfit: false,
        profitUsed: v
      })
      app.globalData.curClient.profitUsed = v;
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    if (app.globalData.curClient) {
      this.setData({
        client: app.globalData.curClient,
        voucherUsed: app.globalData.curClient.voucherUsed || 0,
        profitUsed: app.globalData.curClient.profitUsed || 0
      })
    }
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