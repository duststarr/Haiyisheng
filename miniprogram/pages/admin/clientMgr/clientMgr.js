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
  onShow: function () {
    const that = this
    app.wxcloud('clientGetList').then(res => {
      const clients = res.result
      that.setData({
        clients
      })
    })
  },
  onClient: function(e){
    const pos = e.currentTarget.dataset.pos;
    app.globalData.curClient = this.data.clients[pos];
    wx.navigateTo({
      url: '/pages/admin/client/client',
    })
  }

})