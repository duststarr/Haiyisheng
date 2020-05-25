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
    console.log('userDetailUpdated', detail)

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
  checkboxChange: function (e) {
    const val = e.detail.value;
    app.globalData.userDetail.isAdmin = val.includes('isAdmin')
    app.globalData.userDetail.isClient = val.includes('isClient')
    app.globalData.userDetail.isWorker = val.includes('isWorker')
    app.globalEmit('userDetail')
  },
  sliderChange: function (e) {
    app.globalData.debugDays = e.detail.value
    app.globalEmit('debugDays')
  }
})