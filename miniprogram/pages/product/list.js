const SWIPER_MAX = 5;

Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    cardCur: 0,
    swiperList: [
      {
        id: 2,
        type: 'image',
        url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big39000.jpg'
      }
    ]
  },
  attached: function(){
    const db = wx.cloud.database();
    db.collection('swiper').get().then( res => {
      this.setData({
        swiperList: res.data
      })
    })
  },
  methods: {
    showIntro: function(e){
      const id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: '/pages/product/detail?id='+id
      })
    }
  }
})
