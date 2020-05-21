import wxcloud from '/utils/wxcloud.js'



!function () {
  var PageTmp = Page;

  Page = function (pageConfig) {

    // 设置全局默认分享
    pageConfig = Object.assign({
      onShareAppMessage: function () {
        const app = getApp();
        console.log('global share with openid:' + app.globalData.openid)
        return {
          title: '海益生净水器',
          path: '/pages/home/home?action=marketing&openid=' + app.globalData.openid,
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
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
      // global functions
      this.wxcloud = wxcloud;
      // 鉴权
      this.authentication(e);
    }
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //     console.log('onLaunch login', res)
    //   }
    // })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              console.log("userinfo", res.userInfo)
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
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
  },
  authentication: function (e) {
    const param = {func:'login'}// 云函数参数不能全为空
    const that = this;
    if (e.query && e.query.action) {
      param.action = e.query.action
      param.fromWho = e.query.openid
    }
    wx.cloud.callFunction({
      name: 'login',
      data: param,
      success: res => {
        console.log('[云函数] [login] openid:', res.result.openid)
        that.globalData.openid = res.result.openid
        if (res.result.userDetail) {
          that.globalData.userDetail = res.result.userDetail
          if (that.userDetailReadyCallback) {
            that.userDetailReadyCallback(res.result.userDetail)
          }
        }
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
    // switch (action) {
    //   case 'recruit': { // 招募工人或邀请合作商

    //   } break;
    //   case 'marketing': { // 会员推广
    //     wx.showModal({
    //       title: "推荐人：",
    //       content: "openid:" + fromWho
    //     })
    //   } break;
    // }
  },
  onShow: function (e) {


  },
  globalData: {
    userInfo: null, // 微信userinfo
    openid: '',
    userDetail: null, // 项目本身的user表
    ColorList: [{
      title: '嫣红',
      name: 'red',
      color: '#e54d42'
    },
    {
      title: '桔橙',
      name: 'orange',
      color: '#f37b1d'
    },
    {
      title: '明黄',
      name: 'yellow',
      color: '#fbbd08'
    },
    {
      title: '橄榄',
      name: 'olive',
      color: '#8dc63f'
    },
    {
      title: '森绿',
      name: 'green',
      color: '#39b54a'
    },
    {
      title: '天青',
      name: 'cyan',
      color: '#1cbbb4'
    },
    {
      title: '海蓝',
      name: 'blue',
      color: '#0081ff'
    },
    {
      title: '姹紫',
      name: 'purple',
      color: '#6739b6'
    },
    {
      title: '木槿',
      name: 'mauve',
      color: '#9c26b0'
    },
    {
      title: '桃粉',
      name: 'pink',
      color: '#e03997'
    },
    {
      title: '棕褐',
      name: 'brown',
      color: '#a5673f'
    },
    {
      title: '玄灰',
      name: 'grey',
      color: '#8799a3'
    },
    {
      title: '草灰',
      name: 'gray',
      color: '#aaaaaa'
    },
    {
      title: '墨黑',
      name: 'black',
      color: '#333333'
    },
    {
      title: '雅白',
      name: 'white',
      color: '#ffffff'
    },
    ]
  }
})