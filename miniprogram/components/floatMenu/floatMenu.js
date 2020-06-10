// components/floatMenu/floatMenu.js
import util from '../../utils/util.js';

const app = getApp()
let temp = {}
Component({
  /**
  * 组件的一些选项
  */
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    posX: {
      type: Number,
      value: 10
    },
    posY: {
      type: Number,
      value: 100
    },
    height: {
      type: Number,
      value: 100
    },
    width: {
      type: Number,
      value: 100
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showConsole: false,

    maxX: 750,
    maxY: 1080,
    isClient: false,
    isWorker: false,
    isAdmin: false,
    date1: '',
    date2: '',
    date3: ''
  },
  attached: function () {
    const that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          maxX: res.windowWidth - that.data.width,
          maxY: res.windowHeight - that.data.height
        })
      },
    })
    app.globalWatch('userDetail', res => {
      that.setData({
        isClient: res.isClient,
        isAdmin: res.isAdmin,
        isWorker: res.isWorker,
      })
      if (res.filters) {
        that.setData({
          date1: res.filters.first,
          date2: res.filters.second,
          date3: res.filters.third,
        })
      }
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTouchStart: function (e) {
      temp.lastX = e.touches[0].pageX
      temp.lastY = e.touches[0].pageY
    },
    onTouchMove: function (e) {
      let moveX = e.touches[0].pageX - temp.lastX
      let moveY = e.touches[0].pageY - temp.lastY
      temp.lastX = e.touches[0].pageX
      temp.lastY = e.touches[0].pageY

      let newX = this.data.posX + moveX;
      let newY = this.data.posY + moveY;
      newX = newX < 0 ? 0 : newX;
      newX = newX > this.data.maxX ? this.data.maxX : newX;
      newY = newY < 0 ? 0 : newY;
      newY = newY > this.data.maxY ? this.data.maxY : newY;

      this.setData({
        posX: newX,
        posY: newY
      })
    },
    onTouchEnd: function (e) {

    },
    onTouchCancel: function (e) {

    },
    onTap: function (e) {
      this.setData({
        showConsole: !this.data.showConsole
      })
    },
    hideModal(e) {
      this.setData({
        showConsole: false
      })
    },
    onModalClick(e) {
      this.hideModal();
    },
    onDialogClick(e) {
    },

    /**=============================
  * debug functions
  * 
  */
    checkboxChange: function (e) {
      const val = e.detail.value;
      app.globalData.userDetail.isAdmin = val.includes('isAdmin')
      app.globalData.userDetail.isClient = val.includes('isClient')
      app.globalData.userDetail.isWorker = val.includes('isWorker')
      app.globalEmit('userDetail')
    },
    sliderChange: function (e) {
      app.globalData.debugDays = e.detail.value
      app.globalEmit('debugDays')
    },
    DateChange1: async function (e) {
      const date = new Date(e.detail.value)
      console.log(date)
      const openid = app.globalData.userDetail._openid
      const db = wx.cloud.database()
      const db_user = db.collection('user')
      await db_user.doc(openid).update({
        data: {
          "filters.first": date
        }
      })

    },
    DateChange2: async function (e) {
      const date = new Date(e.detail.value)
      const openid = app.globalData.userDetail._openid
      const db = wx.cloud.database()
      const db_user = db.collection('user')
      await db_user.doc(openid).update({
        data: {
          "filters.second": date
        }
      })

    },
    DateChange3: async function (e) {
      const date = new Date(e.detail.value)
      const openid = app.globalData.userDetail._openid
      const db = wx.cloud.database()
      const db_user = db.collection('user')
      await db_user.doc(openid).update({
        data: {
          "filters.third": date
        }
      })

    },
    testPay: function(e){
      wx.cloud.callFunction({
        name: 'pay',
        data: {
          bodyMsg:'测试支付0.01元',
          totalFee: 1
        },
        success: res => {
          const payment = res.result.payment
          console.log("cloud payment",payment)
          wx.requestPayment({
            ...payment,
            success (res) {
              console.log('pay success', res)
              wx.showToast({
                title: 'pay success',
                icon:'none'
              })
            },
            fail (err) {
              console.error('pay fail', err)
              wx.showToast({
                title: 'pay fail!!!',
                icon:'none'
              })
            }
          })
        },
        fail: console.error,
      })
    }
  },


})
