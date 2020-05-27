import * as echarts from '../../ec-canvas/echarts';

let chart = null;
let component = null;

function initChart(canvas, width, height, dpr) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // 像素
  });
  canvas.setChart(chart);

  const option = {
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
            [0.7, '#0081ff'],
            [0.9, '#fbbd08'],
            [1, '#e54d42']
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
function dateDiff(second) {
  const firstDate = new Date();
  const secondDate = new Date(second);
  const diff = Math.abs(firstDate.getTime() - secondDate.getTime())
  var result = parseInt(diff / (1000 * 60 * 60 * 24));
  // 调试用，模拟多少天以后
  result += app.globalData.debugDays || 0
  return result
}
const app = getApp();

Component({
  options: {
    addGlobalClass: true,
  },
  attached: async function () {
    component = this;
    let that = this;
    setTimeout(function () {
      that.setData({
        loading: true
      })
      app.globalWatch('userDetail', that.updateDatas)
      app.globalWatch('debugDays', that.updateDatas)
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
    updateDatas(e) {
      const today = new Date()

      // 更新服务时间
      const userData = app.globalData.userDetail
      const alldays = userData.serviceDays || 365
      const pastdays = dateDiff(userData.serviceStart || today)
      var cores;
      if (userData.filters) {
        cores = userData.filters
      } else {
        console.log('no filters datas')
        cores = {
          first: today,
          second: today,
          third: today
        }
      }
      const filter1 = dateDiff(cores.first)
      const lifespan1 = parseInt(100 - 100 * filter1 / 180)
      const filter2 = dateDiff(cores.second)
      const lifespan2 = parseInt(100 - 100 * filter2 / 330)
      const filter3 = dateDiff(cores.third)
      const lifespan3 = parseInt(100 - 100 * filter3 / 480)

      chart.setOption({
        series: [{
          max: alldays,
          data: [{
            value: pastdays
          }]
        }]
      })
      component.setData({
        'filters[0].lifespan': lifespan1,
        'filters[1].lifespan': lifespan2,
        'filters[2].lifespan': lifespan3,
        'filters[3].lifespan': lifespan3,
        'filters[4].lifespan': lifespan3
      })
    }
  }
})
