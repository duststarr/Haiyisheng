const app = getApp();
let that = null;
Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    oldclients: null
  },
  attached: async function () {
    that = this
    this.getOldclientRequests()
  },
  pageLifetimes: {
    show: function () {
      console.log('show')
      this.getOldclientRequests()
    }
  },

  methods: {
    onOldClient: function (e) {
      const pos = e.currentTarget.dataset.pos;
      const old = this.data.oldclients[pos];
      console.log(old)
      app.globalData.oldclient = old
      wx.navigateTo({
        url: '/pages/oldClient/oldClient'
      })
    },
    getOldclientRequests: function () {
      if (app.globalData.userDetail.isAdmin) {
        app.wxcloud('getOldclientRequests').then(res => {
          console.log('getOldclientRequests', res)
          that.setData({
            oldclients: res.result
          })
        })
      }
    },
  },
})
