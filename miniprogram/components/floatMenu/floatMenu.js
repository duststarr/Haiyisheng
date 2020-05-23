// components/floatMenu/floatMenu.js
var temp = {}
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
    posX:{
      type: Number,
      value: 10
    },
    posY:{
      type: Number,
      value: 100
    },
    height:{
      type: Number,
      value: 100
    },
    width:{
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
    maxY: 1080
  },
  attached: function () {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          maxX: res.windowWidth - that.data.width,
          maxY: res.windowHeight - that.data.height
        })
      },
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
      var moveX = e.touches[0].pageX - temp.lastX
      var moveY = e.touches[0].pageY - temp.lastY
      temp.lastX = e.touches[0].pageX
      temp.lastY = e.touches[0].pageY

      var newX = this.data.posX + moveX;
      var newY = this.data.posY + moveY;
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
    }
  },


})
