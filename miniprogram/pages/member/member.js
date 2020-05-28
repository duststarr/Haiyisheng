const app = getApp();

Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    fans: 0,
    qrcode
  },
  attached: function () {
    const that = this
    app.globalWatch('userDetail', detail => {
      that.setData({
        fans: detail.fans || 0
      })
    })
    // app.wxcloud('generateQRcode').then(res => {
    //   // this.setData({
    //   //   qrcode: res.result.fileID
    //   // })
    // })

  },
  methods: {

  }
})
