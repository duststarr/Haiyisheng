// miniprogram/pages/aftersale/aftersale.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: null
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

})