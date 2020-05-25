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
   * 必须在云端user库中有数据后才执行
   */
  userDetailUpdated: function () {
    const detail = app.globalData.userDetail

    // 是否有客服邀请
    const param = wx.getLaunchOptionsSync();
    if (!detail.isWorker && param.query && param.query.action == 'recruit' && !app.globalData.roger) {
      wx.navigateTo({
        url: '/pages/worker/invitation/invitation',
      })
    } else {
      this.setData({
        isAdmin: detail.isAdmin,
        isWorker: detail.isWorker,
        isClient: detail.isClient
      })
    }
  },
  onLoad: function (options) {
    console.log('home onLoad',options)
  },
  onShow: function (options) {
    // 获取用户信息
    var that = this
    if (app.globalData.userDetail) {
      that.userDetailUpdated()
    } else {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userDetailReadyCallback = res => {
        that.userDetailUpdated();
      }
    }
  },

  checkboxChange: function (e) {
    const val = e.detail.value;
    this.setData({
      isAdmin: val.includes('isAdmin'),
      isClient: val.includes('isClient'),
      isWorker: val.includes('isWorker')
    })
    app.globalData.userDetail.isAdmin = val.includes('isAdmin')
    app.globalData.userDetail.isClient = val.includes('isClient')
    app.globalData.userDetail.isWorker = val.includes('isWorker')
  },
  sliderChange: function(e){
    app.globalData.debugDays = e.detail.value
  }
})