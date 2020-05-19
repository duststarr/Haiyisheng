const app = getApp()

Page({
  data: {
    CustomBar: app.globalData.CustomBar,

    orders: null,
    stateCurr: 0,
    typeCurr: 0,
    types: ['全部', '新装', '拆机', '移机', '换芯', '报修'],//新装，移机，拆机，换芯，报修
    states: ['全部状态', '待处理','进行中','已完成']
  },
  StateChange(e) {
    this.setData({
      stateCurr: e.currentTarget.dataset.id
    })
    this.updateState()
  },
  TypeChange(e) {
    this.setData({
      typeCurr: e.currentTarget.dataset.id
    })
    this.updateState()
  },
  updateState() {
    var that = this
    var param = {}
    if(0 != this.data.stateCurr)
      param.state = this.data.states[this.data.stateCurr]
    if(0 != this.data.typeCurr)
      param.type = this.data.types[this.data.typeCurr]
    app.wxcloud('orderGet', param).then(res => {
      console.log(res.result)
      that.setData({
        orders: res.result || null
      })
      console.log(this.data.orders.length)
    })
  },
  onShow: function () {
    this.updateState();
  }
})