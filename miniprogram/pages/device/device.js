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
        lifespan: 80,
        intro: "PP膜PP膜PP膜PP膜PP膜"
      },
      {
        pos: '2',
        name: '活性炭',
        lifespan: 40,
        intro: "活性炭活性炭活性炭"
      },
      {
        pos: '3',
        name: '超滤膜',
        lifespan: 70,
        intro: "超滤膜超滤膜超滤膜超滤膜超滤膜"
      },
      {
        pos: '4',
        name: 'RO膜',
        lifespan: 90,
        intro: "RO膜"
      },
      {
        pos: '5',
        name: '活性炭',
        lifespan: 60,
        intro: "活性炭活性炭活性炭活性炭活性炭活性炭活性炭活性炭活性炭活性炭"
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
