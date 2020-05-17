// miniprogram/pages/order/order.js
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
    }, ],
    currstep: 0,
    addressInfo: null,
    logs: [
      {content: '已预约，稍后客服将与您约定上门安装时间。感谢您选择我们的产品。'},
      {content: '客服9527已接单，电话13611112222'},
      {content: '工人安装完成后，充值开启服务吧。'},
      {content: '2020-06-06开启净水生活'},
    ]
  },
  nextStep() {
    this.setData({
      currstep: this.data.currstep == this.data.steps.length ? 0 : this.data.currstep + 1
    })
  },
  chooseAddress() {
    wx.chooseAddress({
      success: (res) => {
        var curr = this.data.currstep==0?1:this.data.currstep;
        this.setData({
          addressInfo: res,
          currstep: curr
        })
      },
      fail: function(err) {
        console.log(err)
      }
    })
  },
  pay() {

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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})