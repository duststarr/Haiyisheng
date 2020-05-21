// miniprogram/pages/worker/invitation/invitation.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  onSure: function () {
    const db = wx.cloud.database();
    const user = db.collection('user')
    const detail = app.globalData.userDetail
    if (detail && !detail.isWorker) {
      user.doc(app.globalData.userDetail._id).update({
        data: {
          isWorker: true,
          timeBeWorker: new Date()
        },
        success: function (res) {
          app.globalData.userDetail.isWorker = true;
          wx.navigateBack()
        }
      })
    }
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