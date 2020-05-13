// miniprogram/pages/product/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    message: '请输入手机号，稍后客服会与您取得联系。'
  },
  formSubmit(e) {
    var msg = "预约成功";
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    console.log(e.detail.value)
    var phone = e.detail.value.phone
    if (!myreg.test(phone)) {
      msg = "请输入正确的手机号码"
    }else{
      msg = "预约成功,稍后客服会与"+phone+"取得联系，请注意接听电话。祝您生活愉快。"
    }
    this.setData({
      message : msg
    })
    wx.showToast({
      title: msg,
      icon: 'none',
      duration: 2000
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
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