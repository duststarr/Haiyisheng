// miniprogram/pages/aftersale/aftersale.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: null,
    worktype: 0
  },
  methods: {
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    app.globalWatch('userDetail',res=>{
      that.setData({
        address: res.address
      })
    })
  },
  onMove: function(){
    this.setData({
      worktype: 1
    })
  },
  onDestroy: function(){
    this.setData({
      worktype: 2
    })
  },
  onExchange: function(){
    this.setData({
      worktype: 3
    })
  },
  onRepair: function(){
    this.setData({
      worktype: 4
    })
  },
  onCancel: function(){
    this.setData({
      worktype: 0
    })
  }
})