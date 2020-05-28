// miniprogram/pages/member/myQRcode/myQRcode.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qrcode: null
  },
  saveQRcode: function (e) {
    var that = this
    //获取相册授权
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              that.saveQRcodeDo()
            }
          })
        } else {
          that.saveQRcodeDo()
        }
      }
    })
  },
  saveQRcodeDo: function () {
    var that = this
    wx.cloud.getTempFileURL({
      fileList: [that.data.qrcode],
      success: res => {
        // get temp file URL
        wx.downloadFile({
          url: res.fileList[0].tempFileURL,
          success: function (res) {
            //图片保存到本地
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: function (data) {
                wx.showToast({
                  title: '保存成功',
                  icon: 'success',
                  duration: 2000
                })
              },
              fail: function (err) {
                if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
                  wx.openSetting({
                    success(settingdata) {
                      if (settingdata.authSetting['scope.writePhotosAlbum']) {
                        console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                      } else {
                        console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                      }
                    }
                  })
                }
              },
              complete(res) {
                console.log(res);
              }
            })
          }
        })
      },
      fail: err => {
        // handle error
      }
    })

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: async function () {
    const qr = await app.wxcloud('generateQRcode')
    console.log('qr', qr)
    this.setData({
      qrcode: qr.result.fileID
    })
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