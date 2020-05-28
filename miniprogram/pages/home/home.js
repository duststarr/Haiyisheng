const app = getApp()

Page({
  data: {
    PageCur: 'product',
    isAdmin: false,
    isWorker: false,
    isClient: false
  },
  NavChange(e) {
    this.setData({
      PageCur: e.currentTarget.dataset.cur
    })
  },
  /**
   * 
   * 更新权限
   */
  userDetailUpdated: function (detail) {
    this.setData({
      isAdmin: detail.isAdmin,
      isWorker: detail.isWorker,
      isClient: detail.isClient
    })
    // 是否有客服邀请
    const param = wx.getLaunchOptionsSync();
    if (!detail.isWorker && param.query && param.query.action == 'recruit' && !app.globalData.roger) {
      wx.navigateTo({
        url: '/pages/worker/invitation/invitation',
      })
    }
  },
  onLoad: function (options) {
    console.log('home onLoad', options)
    app.globalWatch('userDetail', this.userDetailUpdated)
  },
 
})