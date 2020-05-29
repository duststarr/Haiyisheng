// miniprogram/pages/admin/clientMgr/clientMgr.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    clients: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    app.wxcloud('clientGetList').then(res => {
      const clients = res.result
      that.setData({
        clients
      })
    })
  },

})