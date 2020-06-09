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
        url: 'cloud://hys-k9bhf.6879-hys-k9bhf-1302238335/1.png'
      },
      {
        id: 1,
        type: 'image',
        url: 'cloud://hys-k9bhf.6879-hys-k9bhf-1302238335/2.png'
      },
      {
        id: 2,
        type: 'image',
        url: 'cloud://hys-k9bhf.6879-hys-k9bhf-1302238335/3.png'
      },
      {
        id: 3,
        type: 'image',
        url: 'cloud://hys-k9bhf.6879-hys-k9bhf-1302238335/4.png'
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
