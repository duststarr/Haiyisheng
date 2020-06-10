// miniprogram/pages/worker/invitation/invitation.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    errormsg: null,
    phone: '13',
    name: '',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUsegetPhoneNumber: wx.canIUse('button.open-type.getPhoneNumber')
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    app.globalEmit('userInfo')
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  getPhoneNumber: function (e) {
    console.log(e)
  },
  onSure: function (e) {
    const myreg = /^[1][3,4,5,7,8][0-9]{9}$/;

    const formdata = e.detail.value
    if ("" == formdata.name) {
      this.setData({
        errormsg: '请输入姓名'
      })
      return
    } else if (!myreg.test(formdata.phone)) {
      this.setData({
        errormsg: '请输入正确的手机号码'
      })
      return
    }
    const db = wx.cloud.database();
    const user = db.collection('user')
    const detail = app.globalData.userDetail
    if (detail && !detail.isWorker) {
      const param = wx.getLaunchOptionsSync()
      const fromWho = param.query.openid // 邀请加入的管理员的openid
      user.doc(app.globalData.userDetail._id).update({
        data: {
          isWorker: true,
          workerFromWho: fromWho,
          name: formdata.name,
          phone: formdata.phone,
          avatar: this.data.hasUserInfo ? this.data.userInfo.avatarUrl : '',
          timeBeWorker: new Date()
        },
        success: function (res) {
          wx.showToast({
            title: '恭喜您已成功加入海益团队',
            icon: 'none',
            duration: 2000,
            success: () => {
              setTimeout(()=>{
                wx.redirectTo({
                  url: '/pages/home/home',
                })
              }, 2000)
            }
          })
        }
      })
    } else {
      wx.navigateBack()
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.globalData.roger = true // 邀请已收到,避免重复处理
    const that = this
    app.globalWatch('userInfo', res => {
      that.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    })
  },

})