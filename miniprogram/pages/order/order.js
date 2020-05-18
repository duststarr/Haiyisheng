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
    addressInfo: null,
    logs: [
      { content: '已预约，稍后客服将与您约定上门安装时间。感谢您选择我们的产品。' },
      { content: '客服9527已接单，电话13611112222' },
      { content: '工人安装完成后，充值开启服务吧。' },
      { content: '2020-06-06开启净水生活' },
    ]
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
  changeAddress() {
    wx.showToast({
      title: '暂时不可更改',
      icon: 'none',
      duration: 3000
    })
  },
  pay() {
    wx.navigateTo({
      url: '/pages/payment/payment'
    })
  },
  updateState() {
    console.log('call updateSate')
    var that = this;
    wx.cloud.callFunction({
      name: 'haiyisheng',
      data: { action: 'userGetOrderInfo' },
      success: res => {
        console.log('cloud userGetOrderInfo', res)
        if (res.result.length == 0)
          return;
        const result = res.result[0];
        var state = result.state;
        that.setData({
          addressInfo: result.addr1,
          state: state,
          logs: result.logs
        }) 
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