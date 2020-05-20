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
  userDetailUpdated: function(){
    const detail = app.globalData.userDetail
    console.log('userDetailUpdated',detail)
    this.setData({
      isAdmin: detail.isAdmin,
      isWorker: detail.isWorker,
      isClient: detail.isClient
    })
  },
  onLoad: function (options) {
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
  }
})