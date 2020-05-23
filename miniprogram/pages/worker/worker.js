const app = getApp();

Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    motto: 'Hi 开发者！',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    orders: null
  },
  attached: function () {
    const that = this
    if (app.globalData.userInfo) {
      that.userinfoReady(app.globalData.userInfo)
    } else if (this.data.canIUse) {
      app.userInfoReadyCallback = res => {
        that.userinfoReady(res.userInfo)
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          that.userinfoReady(res.userInfo)
        }
      })
    }
  },
  methods: {
    getUserInfo: function (e) {
      console.log(e)
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
    },
    userinfoReady: function (info) {
      this.setData({
        userInfo: info,
        hasUserInfo: true
      })
      this.getOrders();
    },
    getOrders() {
      const that = this
      const param = {}
      param.isWorker = true
      app.wxcloud('orderGetList', param).then(res => {
        that.setData({
          orders: res.result || null
        })
      })
    },
    orderPick(e){
      const pos = e.currentTarget.dataset.pos
      const orderID = this.data.orders[pos]._id
      const that = this
      const slotState = 'orders['+pos+'].state'
      app.wxcloud('orderPick',{orderID}).then(res => {
        that.setData({
          [slotState]: '待执行'
        })
      })
    },
    orderWorkdone(e){
      const pos = e.currentTarget.dataset.pos
      const orderID = this.data.orders[pos]._id
      const that = this
      const slotState = 'orders['+pos+'].state'
      app.wxcloud('orderWorkdone',{orderID}).then(res => {
        that.setData({
          [slotState]: '待确认'
        })
      })
    }
  }
})
