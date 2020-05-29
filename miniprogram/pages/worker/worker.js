const app = getApp();

Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    numInstall: 0,
    numAftersale: 0,
    numInstallWorking: 0,
    numAftersaleWorking: 0,
    showInstall: true,
    showAftersale: true,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    orders: null,
    stateColors: app.globalData.stateColors
  },
  attached: function () {
    const that = this
    app.globalWatch('userInfo', res => {
      that.setData({
        userInfo: res,
        hasUserInfo: true
      })
      this.getOrders();
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
    },
    getOrders(sub = null) {
      const that = this
      const param = {}
      param.isWorker = true
      if (sub)
        param.sub = sub
      app.wxcloud('orderGetList', param).then(res => {
        that.setData({
          orders: res.result || null
        })
        that.countOrders()
      })
    },
    countOrders() {
      let numInstall = 0
      let numAftersale = 0
      let numInstallWorking = 0
      let numAftersaleWorking = 0
      this.data.orders.forEach(order => {
        if ('新装' == order.type) {
          numInstall += 1
          if (!order.timeWorkdone)
            numInstallWorking += 1
        } else {
          numAftersale += 1
          if (!order.timeWorkdone)
            numAftersaleWorking += 1
        }
      })
      this.setData({
        numInstall,
        numAftersale,
        numInstallWorking,
        numAftersaleWorking
      })
    },
    orderPick(e) {
      const pos = e.currentTarget.dataset.pos
      const orderID = this.data.orders[pos]._id
      const that = this
      const slotPick = 'orders[' + pos + '].timePick'
      app.wxcloud('orderPick', { orderID }).then(res => {
        that.setData({
          [slotPick]: new Date()
        })
      })
    },
    orderWorkdone(e) {
      const pos = e.currentTarget.dataset.pos
      const orderID = this.data.orders[pos]._id
      const that = this
      const slotWorkdone = 'orders[' + pos + '].timeWorkdone'
      app.wxcloud('orderWorkdone', { orderID }).then(res => {
        that.setData({
          [slotWorkdone]: new Date()
        })
        that.countOrders()

      })
    },
    onToggleInstall(e) {
      this.setData({
        showInstall: !this.data.showInstall
      })
    },
    onToggleAftersale(e) {
      this.setData({
        showAftersale: !this.data.showAftersale
      })
    }
  }
})
