const app = getApp()

Page({
  data: {
    CustomBar: app.globalData.CustomBar,
    workers: null,
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
    this.getOrders()
  },
  TypeChange(e) {
    this.setData({
      typeCurr: e.currentTarget.dataset.id
    })
    this.getOrders()
  },
  getOrders() {
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
  onDispatch: function (e) {
    const pos = e.currentTarget.dataset.id;

  },
  workerChange: function (e) {
    console.log('workerChange', e)
    var that = this
    var param = {}
    var worker = this.data.workers[e.detail.value]
    const pos = e.currentTarget.dataset.pos
    param.orderID = this.data.orders[pos]._id
    param.worker = {
      workerID: worker._id,
      name: worker.name,
      phone: worker.phone
    }
    var slotState = 'orders[' + pos + '].state'
    var slotWorker = 'orders[' + pos + '].worker'
    app.wxcloud('orderDispatchWorker', param).then(res => {
      that.setData({
        [slotState]: '待接单',
        [slotWorker]: worker
      })
    })
  },
  onShow: function () {
    this.getOrders();
    var that = this
    app.wxcloud('workerGetList').then(res => {
      console.log('workerGetList', res.result)
      that.setData({
        workers: res.result
      })
    })
  }
})