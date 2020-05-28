// miniprogram/pages/admin/workerMgr/workerMgr.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    workers: []
  },
  fetchData() {
    var that = this
    app.wxcloud('workerGetList').then(res => {
      that.setData({
        workers: res.result
      })
    })
  },
  // ListTouch触摸开始
  ListTouchStart(e) {
    this.setData({
      ListTouchStart: e.touches[0].pageX
    })
  },

  // ListTouch计算方向
  ListTouchMove(e) {
    this.setData({
      ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
    })
  },

  // ListTouch计算滚动
  ListTouchEnd(e) {
    if (this.data.ListTouchDirection == 'left') {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    } else {
      this.setData({
        modalName: null
      })
    }
    this.setData({
      ListTouchDirection: null
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    if (app.globalData.userInfo) {
      this.fetchData()
    } else {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        that.fetchData();
      }
    }
  },

  /**
   * 本页的专属分享，取代全局配置
   */
  onShareAppMessage: function () {
    console.log('workerMgr share')
    return {
      title: '加入海益生',
      path: '/pages/home/home?action=recruit&openid=' + app.globalData.userDetail._openid,
      imageUrl: '/images/logo.jpg',
    }
  }
})