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
    earningsList: null,
    profit: 0, //现金收益
    profitUsed: 0,
    profitLeft: 0
  },
  attached: function () {
    const that = this
    // 个人信息
    app.globalWatch('userDetail', detail => {
      if (!detail.qrcode) {
        app.wxcloud('generateQRcode')
        return; // 等待下次变更
      }
      const profitUsed = detail.profitUsed || 0
      const profitLeft = that.data.profit - profitUsed
      const voucherUsed = detail.voucherUsed || 0
      const voucherLeft = that.data.vouchers - voucherUsed
      that.setData({
        fans: detail.fans || 0,
        voucherUsed,
        voucherLeft,
        profitUsed,
        profitLeft,
        qrcode: detail.qrcode
      })
      if (!detail.isClient) {
        return;
      }
      // 我推广的设备
      app.wxcloud('getFirends').then(res => {
        const firends = res.result
        const arr = that.data.earningsList || []
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
          firends,
          earningsList: arr,
          vouchers,
          voucherLeft: vouchers - that.data.voucherUsed
        })
      })
      //我的现金收益
      // @result 我的下线的续费充值情况
      app.wxcloud('clientProfit').then(res => {
        const that = this
        const arr = that.data.earningsList || []
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
    })
  },
  methods: {

  }
})