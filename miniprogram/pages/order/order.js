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
    loadModal: false,
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
      success: (res) => {
        wx.cloud.callFunction({
          name: 'haiyisheng',
          data: {
            action: 'setupOrder',
            address: res
          },
          success: res => {
            that.updateState();
          }
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  cancelOrder() {
    var that = this;
    this.setData({ loadModal: true })

    wx.cloud.callFunction({
      name: 'haiyisheng',
      data: { action: 'cancelOrder' },
      success: res => {
        this.setData({ loadModal: false })
        this.setData({ order: null })

        that.updateState()
      },
      fail: res => {
        this.setData({ loadModal: false })
      }
    })
  },
  pay() {
    wx.navigateTo({
      url: '/pages/payment/payment'
    })
  },
  updateState() {
    var that = this;
    this.setData({ loadModal: true })
    wx.cloud.callFunction({
      name: 'haiyisheng',
      data: { action: 'userGetOrderInfo' },
      success: res => {
        that.setData({ loadModal: false })
        that.setData({
          order: res.result[0]
        })
      },
      fail: () => {
        console.log('cloud function error')
        that.setData({ loadModal: false })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.updateState();
  }

})