const app = getApp();

Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    fans: 0, //粉丝数
    qrcode: null,
    firends: null,
    vouchers: 0, // 代金券
    voucherUsed: 0,
    voucherLeft: 0,
    earningsList: [],
    profit: 0, //现金收益
    profitUsed: 0,
    profitLeft: 0
  },
  attached: function () {
    const that = this
    // 个人信息
    app.globalWatch('userDetail', detail => {
      that.setData({
        fans: detail.fans || 0,
        voucherUsed: detail.voucherUsed || 0,
        profitUsed: detail.profitUsed || 0
      })
    })
    // 二维码
    app.wxcloud('generateQRcode').then(res => {
      this.setData({
        qrcode: res.result.fileID
      })
      app.globalData.qrcode = res.result.fileID
      app.globalEmit('qrcode')
    })
    // 收益详情列表
    const earningsList = []
    // 我推广的设备
    app.wxcloud('getFirends').then(res => {
      const firends = res.result
      that.setData({
        firends
      })
      const arr = that.data.earningsList
      let vouchers = 0
      firends.forEach(firend => {
        arr.push({
          name: firend.name,
          date: firend.date,
          event: '新装',
          profit: '代金券1张'
        })
        vouchers += 1
      })
      that.setData({
        earningsList: arr,
        vouchers,
        voucherLeft: vouchers - that.data.voucherUsed
      })
    })
    //我的现金收益
    // @result 我的下线的续费充值情况
    app.wxcloud('clientProfit').then(res => {
      const that = this
      const arr = that.data.earningsList
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
        earningsList: arr,
        profit,
        profitLeft: profit - that.data.profitUsed
      })
    })
  },
  methods: {

  }
})
