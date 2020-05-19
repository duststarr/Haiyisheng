// miniprogram/pages/order/order.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
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
  nextStep() {
    this.setData({
      currstep: this.data.currstep == this.data.steps.length ? 0 : this.data.currstep + 1
    })
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
    app.wxcloud('orderCancel').then(this.updateState)
  },
  pay() {
    wx.navigateTo({
      url: '/pages/payment/payment'
    })
  },
  updateState() {
    var that = this
    app.wxcloud('orderGetCreating').then(res => {
      that.setData({
        order: res.result[0] || null
      })
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.updateState();
  }

})