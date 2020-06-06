// miniprogram/pages/admin/workerMgr/workerMgr.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    workers: []
  },
  fetchData() {
    const that = this
    app.wxcloud('workerGetList',{needCountOrders:true}).then(res => {
      console.log(res.result)
      that.setData({
        workers: res.result
      })
    })
  },
  // ListTouch触摸开始
  ListTouchStart(e) {
    this.setData({
      ListTouchStart: e.touches[0].pageX
    })
  },

  // ListTouch计算方向
  ListTouchMove(e) {
    this.setData({
      ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
    })
  },

  // ListTouch计算滚动
  ListTouchEnd(e) {
    if (this.data.ListTouchDirection == 'left') {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    } else {
      this.setData({
        modalName: null
      })
    }
    this.setData({
      ListTouchDirection: null
    })
  },
  onDelete: function (e) {
    const pos = e.currentTarget.dataset.pos
    const worker = this.data.workers[pos]
    const that = this
    wx.showModal({
      title: "删除客服？",
      content: "是否确认删除客服：" + worker.name,
      success: function (res) {
        const workers = that.data.workers
        workers.splice(pos, 1)
        that.setData({
          workers
        })
        app.wxcloud('workerDelete', { openid: worker._openid })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fetchData()
  },

  /**
   * 本页的专属分享，取代全局配置
   */
  onShareAppMessage: function () {
    console.log('workerMgr share')
    return {
      title: '加入海益生',
      path: '/pages/home/home?action=recruit&openid=' + app.globalData.userDetail._openid,
      imageUrl: '/images/logo.jpg',
    }
  }
})