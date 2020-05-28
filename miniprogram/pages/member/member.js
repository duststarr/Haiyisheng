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
    voucherLeft: 0,
    earnings: [],
    profit: 0,
    profitLeft: 0
  },
  attached: function () {
    const that = this
    app.globalWatch('userDetail', detail => {
      that.setData({
        fans: detail.fans || 0,
        vouchers: detail.vouchers || 0,
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
    const earnings = []
    app.wxcloud('getFirends').then(res => {
      const firends = res.result
      that.setData({
        firends
      })
      const arr = that.data.earnings
      firends.forEach(firend => {
        arr.push({
          name: firend.name,
          date: firend.date,
          event: '新装',
          profit: '代金券1张'
        })
      })
      that.setData({
        earnings: arr
      })
    })

    app.wxcloud('clientProfit').then(res => {
      const arr = that.data.earnings
      let profit = 0
      res.result.forEach(payment => {
        const my = (payment.amount * 0.1)
        profit += my
        arr.push({
          name: payment.name,
          date: payment.timePay,
          event: '续费' + payment.amount,
          profit: '现金' + my
        })
      })
      this.setData({
        earnings:arr,
        profit
      })
    })
  },
  methods: {

  }
})
