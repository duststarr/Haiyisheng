// miniprogram/pages/worker/invitation/invitation.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    errormsg: null,
    phone: '136',
    name: '',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUsegetPhoneNumber: wx.canIUse('button.open-type.getPhoneNumber')
  },
  attached: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  getPhoneNumber: function(e){
    console.log()
  },
  onSure: function (e) {
    var formdata = e.detail.value
    if ("" == formdata.name) {
      this.setData({
        errormsg: '请输入姓名'
      })
      return
    } else if ("" == formdata.phone) {
      this.setData({
        errormsg: '请输入手机号'
      })
      return
    }
    const db = wx.cloud.database();
    const user = db.collection('user')
    const detail = app.globalData.userDetail
    if (detail && !detail.isWorker) {
      const param = wx.getLaunchOptionsSync()
      const fromWho = param.openid // 邀请加入的管理员的openid
      user.doc(app.globalData.userDetail._id).update({
        data: {
          isWorker: true,
          workerFromWho: fromWho,
          name: formdata.name,
          phone: formdata.phone,
          avatar: this.data.hasUserInfo ? this.data.userInfo.avatarUrl : '',
          timeBeWorker: new Date()
        },
        success: function (res) {
          app.globalData.userDetail.isWorker = true;
          wx.navigateBack()
        }
      })
    } else {
      wx.navigateBack()
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.globalData.roger = true // 邀请已收到,避免重复处理
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