const app = getApp();

Component({
  data: {
    userInfo: null,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  attached: function () {
    const that = this;
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              that.getUserInfo({
                detail: {
                  userInfo: res.userInfo
                }
              })
            }
          })
        }
      }
    })
  },
  methods: {
    getUserInfo: function (e) {
      app.globalData.userInfo = e.detail.userInfo
      app.globalEmit('userInfo')
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
    }
  }
})
