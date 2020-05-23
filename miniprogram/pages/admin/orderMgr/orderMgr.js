const app = getApp()

Page({
  data: {
    CustomBar: app.globalData.CustomBar,

    orders: null,
    categoryCurr: 0,
    typeCurr: 0,
    types: ['全部', '新装', '拆机', '移机', '换芯', '报修'],//新装，移机，拆机，换芯，报修
    categories: ['全部状态', '待处理', '进行中', '已完成'],
    stateColors: ['']
  },
  StateChange(e) {
    this.setData({
      categoryCurr: e.currentTarget.dataset.id
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
    switch (this.data.categoryCurr) {
      case 1: {
        param.states = ['新订单']
      }
        break;
      case 2: {
        param.states = ['待接单', '待执行', '待确认']
      }
        break;
      case 3: {
        param.states = ['已完成', '已取消']
      }
        break;
    }
    if (0 != this.data.typeCurr)
      param.type = this.data.types[this.data.typeCurr]
    app.wxcloud('orderGetList', param).then(res => {
      that.setData({
        orders: res.result || null
      })
    })
  },
  onDispatch: function(e) {
    const pos = e.currentTarget.dataset.pos;

  },
  onShow: function () {
    this.updateState();
  }
})