const app = getApp();

Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    fans: 0,
    qrcode: app.globalData.qrcode,
    firends: null,
    vouchers: 0,
    voucherLeft:0
  },
  attached: function () {
    const that = this
    app.globalWatch('userDetail', detail => {
      that.setData({
        fans: detail.fans || 0,
        vouchers: detail.vouchers ||0,
        voucherLeft: (detail.vouchers - detail.voucherUsed) | 0
      })
    })
    if (!this.data.qrcode) {
      app.wxcloud('generateQRcode').then(res => {
        this.setData({
          qrcode: res.result.fileID
        })
        app.globalData.qrcode = res.result.fileID
        app.globalEmit('qrcode')
      })
    }

    app.wxcloud('getFirends').then(res => {
      that.setData({
        firends: res.result
      })
    })
  },
  methods: {

  }
})
