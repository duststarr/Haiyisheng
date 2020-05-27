// components/address/address.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    address: null
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    chooseAddress() {
      var that = this;
      wx.chooseAddress({
        success: res => {
          that.setData({
            address: res
          })
          that.triggerEvent('AddressChange', res)
        }
      })
    }
  }
})
