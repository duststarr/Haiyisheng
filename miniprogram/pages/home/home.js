import util from '../../utils/util.js';

const app = getApp()

Page({
  data: {
    PageCur: 'product',
    isAdmin: false,
    isWorker: false,
    isClient: false,
    oldVersion: false
  },
  NavChange(e) {
    this.setData({
      PageCur: e.currentTarget.dataset.cur
    })
    app.globalData.curPage = e.currentTarget.dataset.cur
  },
  /**
   * 
   * 更新权限
   */
  userDetailUpdated: function (detail) {
    this.setData({
      isAdmin: detail.isAdmin,
      isWorker: detail.isWorker,
      isClient: detail.isClient,
      PageCur: detail.isClient ? 'device' : 'product'
    })
    // 是否有客服邀请
    const param = wx.getLaunchOptionsSync();
    if (!detail.isWorker && param.query && param.query.action == 'recruit' && !app.globalData.roger) {
      wx.navigateTo({
        url: '/pages/worker/invitation/invitation',
      })
    }
  },
  onLoad: function (options) {
    const that = this
    app.globalWatch('userDetail', this.userDetailUpdated)
    // 获取系统状态栏信息
    wx.getSystemInfo({
      success: e => {
        const v = e.SDKVersion
        const p = util.compareVersion(v, '2.8.1')
        if (-1 == p) {
          console.log('低版本', v)
          that.setData({
            oldVersion: true
          })
        }
      }
    })

  },
  onShow: async function(){
    if( this.data.oldVersion){
      if(app.globalData.userDetail){
        app.globalUnwatch('userDetail',this.onShow)

        const openid = app.globalData.userDetail._openid
        const db = wx.cloud.database()
        const dbmy = db.collection('user').doc(openid)
        const res = await dbmy.get()
        console.log('oldVersion',res.data)
        app.globalData.userDetail = res.data
        app.globalEmit('userDetail')

      }else{
        console.log('I am early')
        app.globalWatch('userDetail',this.onShow)

      }
    } 
  }

})