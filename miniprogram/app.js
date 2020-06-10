import wxcloud from '/utils/wxcloud.js'
import paycloud from '/utils/paycloud.js'
import globalInit from '/utils/globalData.js'

!function () {
  let PageTmp = Page;

  Page = function (pageConfig) {
    // 设置全局默认分享
    pageConfig = Object.assign({
      onShareAppMessage: function () {
        const app = getApp();
        let path = '/pages/home/home';
        // 如果分享者是客户会员
        if (app.globalData.userDetail && app.globalData.userDetail.isClient) {
          path = path + '?action=marketing&openid=' + app.globalData.userDetail._openid
          console.log('global share with openid:' + app.globalData.userDetail._openid)
        }
        return {
          title: '海益生净水器',
          path: path,
          imageUrl: '/images/logo.jpg',
        };
      }
    }, pageConfig);

    PageTmp(pageConfig);
  };
}();

App({
  onLaunch: function (e) {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
      return
    }
    wx.cloud.init({
      traceUser: true,
    })
    // 获取系统状态栏信息
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
          this.globalData.Custom = capsule;
          this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
        } else {
          this.globalData.CustomBar = e.statusBarHeight + 50;
        }
      }
    })

    // 初始化全局数据监听
    globalInit(this);

    // global functions
    this.wxcloud = wxcloud;
    this.paycloud = paycloud;
    // 鉴权
    var that = this
    this.wxcloud('authentication', { query: e.query })
      .then((res) => { // res.result is openid
        // 监视云端user.my的变动
        const db = wx.cloud.database()
        db.collection('user').doc(res.result)
          .watch({
            onChange: function (snapshot) {
              console.log('watch user', snapshot)
              that.globalData.userDetail = snapshot.docs[0]
              that.globalEmit('userDetail')
            },
            onError: function (err) {
              console.error('watch user error', err)
            }
          })
      })
  },

  globalData: {
    userInfo: null, // 微信userinfo
    userDetail: null, // 项目本身的user表

    stateColors: {
      '新订单': 'blue',
      '待接单': 'green',
      '待执行': 'green',
      '待确认': 'green',
      '已完成': 'grey',
      '已取消': 'grey',
    }
  }
})