const app = getApp()

Page({
  data: {
    CustomBar: app.globalData.CustomBar,

    order: null,
    stateCurr: 0,
    orderCurr: 0,
    orderTypes: ['全部', '新装', '拆机', '移机', '换芯', '报修'],
    states: ['全部状态', '待处理','进行中','已完成']
  },
  StateChange(e) {
    this.setData({
      stateCurr: e.currentTarget.dataset.id
    })
  },
  TypeChange(e) {
    this.setData({
      orderCurr: e.currentTarget.dataset.id
    })
  },
  updateState() {
    var that = this
    app.wxcloud('userGetOrderInfo').then(res => {
      that.setData({
        order: res.result[0] || null
      })
    })
  },
  onShow: function () {
    this.updateState();
  }
})