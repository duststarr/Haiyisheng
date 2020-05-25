Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    cardCur: 0,
    swiperList: [
      {
        id: 0,
        type: 'image',
        url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big39000.jpg'
      },
      {
        id: 1,
        type: 'image',
        url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big39001.jpg'
      },
      {
        id: 2,
        type: 'image',
        url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big39002.jpg'
      }
    ]
  },
  attached: function () {

  },
  methods: {
    showIntro: function (e) {
      const id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: '/pages/order/order?id=' + id
      })
    }
  }
})
