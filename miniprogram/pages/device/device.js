import * as echarts from '../../ec-canvas/echarts';

let chart = null;
function initChart(canvas, width, height, dpr) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // 像素
  });
  canvas.setChart(chart);

  var option = {
    backgroundColor: "#ffffff",
    color: ["#37A2DA", "#32C5E9", "#67E0E3"],
    series: [{
      name: '业务指标',
      type: 'gauge',
      detail: {
        formatter: '已服务{value}天',
        fontSize: 15,
        color: "#0000ff",
        offsetCenter: [0, '80%']
      },
      axisLine: {
        show: true,
        lineStyle: {
          width: 10,
          shadowBlur: 2,
          color: [
            [0.3, '#67e0e3'],
            [0.7, '#37a2da'],
            [1, '#fd666d']
          ]
        }
      },
      splitLine: {
        length: 10
      },
      min: 0,
      max: 365,
      splitNumber: 2,
      data: [{
        value: 80,
        name: '',
      }]

    }]
  };
  chart.setOption(option);
  return chart;
}

const app = getApp();

Component({
  options: {
    addGlobalClass: true,
  },
  attached: function () {
    let that = this;
    setTimeout(function () {
      that.setData({
        loading: true
      })
    }, 500)
  },
  data: {
    cardCur: 0,
    TabCur: 0,
    ColorList: app.globalData.ColorList,
    ec: {
      onInit: initChart
    },
    filters: [
      {
        pos: '1',
        name: 'PP膜',
        lifespan: 25,
        intro: "可以过滤水中泥沙、铁锈、悬浮物、胶体、虫 卵等固态杂质"
      },
      {
        pos: '2',
        name: '活性炭',
        lifespan: 9,
        intro: "深层次吸附水中余氯、卤代物以及对人体有害 的有机物，改善口感"
      },
      {
        pos: '3',
        name: '超滤膜',
        lifespan: 70,
        intro: "去除微生物、重金属离子、细菌、病毒等物质， 保留人体所需矿物质和微量元素"
      },
      {
        pos: '4',
        name: 'RO膜',
        lifespan: 70,
        intro: "进一步有效去除溶解盐类、微生物、重金属离 子、细菌、病毒等物质"
      },
      {
        pos: '5',
        name: '活性炭',
        lifespan: 70,
        intro: "进一步吸附水中异味、异色，改善口感，使出 水更加甘甜可口"
      }
    ]
  },
  methods: {
    tabSelect(e) {
      this.setData({
        TabCur: e.currentTarget.dataset.id
      })
    },
    aftersale(e) {
      wx.navigateTo({
        url: '../aftersale/aftersale',
      })
    }
  }
})
