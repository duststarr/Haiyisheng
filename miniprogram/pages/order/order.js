// miniprogram/pages/order/order.js
const app = getApp()

Page({
  data: {
    steps: [{
      icon: 'locationfill',
      name: '填写信息'
    }, {
      icon: 'radioboxfill',
      name: '联系确认'
    }, {
      icon: 'deliver_fill',
      name: '上门安装'
    }, {
      icon: 'wefill',
      name: '开始服务'
    },],
    currstep: 0,
    order: null
  },
  chooseAddress() {
    var that = this;
    wx.chooseAddress({
      success: res => {
        app.wxcloud('orderCreate', { address: res }).then(that.updateState)
      }
    })
  },
  cancelOrder() {
    if (this.data.order) {
      app.wxcloud('orderCancel', { orderID: this.data.order._id }).then(this.updateState)
    }
  },
  updateState() {
    var that = this
    app.wxcloud('orderGetCreating').then(res => {
      var step = 0
      if (res.result[0]) {
        switch (res.result[0].state) {
          case '新订单':
            step = 0
            break;
          case '待接单':
            step = 1
            break;
          case '待执行':
          case '待确认':
            step = 2
            break;
          default:
            step = 3
            break;
        }
      }
      that.setData({
        order: res.result[0] || null,
        currstep: step
      })
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.updateState();
  },
  debugDelete: async function () {
    this.cancelOrder();
    const db = wx.cloud.database();
    const user = db.collection('user'); // 仅创建者可读写
    await user.doc(app.globalData.userDetail._id).update({
      data: {
        isClient: false
      }
    })
    app.globalData.userDetail.isClient = false
  }
})