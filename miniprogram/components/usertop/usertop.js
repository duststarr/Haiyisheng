const app = getApp();

Component({
  data: {
    userInfo: null,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  attached: function () {
    const that = this
    app.globalWatch('userInfo', res => {
      that.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    })
  },
  methods: {
    getUserInfo: function (e) {
      console.log(e)
      app.globalData.userInfo = e.detail.userInfo
      app.globalEmit('userInfo')
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
    }
  }
})
