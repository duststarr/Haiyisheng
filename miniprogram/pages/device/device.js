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
  let alldays = 365
  let pastdays = 0
  if (app.globalData.userDetail) {
    alldays = app.globalData.userDetail.serviceDays || 365
    pastdays = dateDiff(app.globalData.userDetail.serviceStart || new Date())
  }

  const option = {
    title: {
      text: 'hello',
      show: true,
      textAlign: 'center',
      textStyle: {
        fontSize: 12,
        color: '#f00'
      }
    },
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
      max: alldays,
      splitNumber: 2,
      data: [{
        value: pastdays,
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
  let result = parseInt(diff / (1000 * 60 * 60 * 24));
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
    ec: {
      onInit: initChart
    },
    quality1: 40,
    quality2: 8,
    leftdays: 0,
    filters: [
      {
        pos: '1',
        name: 'PP膜',
        lifespan: 100,
        intro: "可以过滤水中泥沙、铁锈、悬浮物、胶体、虫 卵等固态杂质"
      },
      {
        pos: '2',
        name: '活性炭',
        lifespan: 100,
        intro: "深层次吸附水中余氯、卤代物以及对人体有害 的有机物，改善口感"
      },
      {
        pos: '3',
        name: '超滤膜',
        lifespan: 100,
        intro: "去除微生物、重金属离子、细菌、病毒等物质， 保留人体所需矿物质和微量元素"
      },
      {
        pos: '4',
        name: 'RO膜',
        lifespan: 100,
        intro: "进一步有效去除溶解盐类、微生物、重金属离 子、细菌、病毒等物质"
      },
      {
        pos: '5',
        name: '活性炭',
        lifespan: 100,
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
      const userData = app.globalData.userDetail
      const quality1 = userData.quality1 || 45
      const quality2 = userData.quality2 || 8

      if (userData.filters) {
        const cores = userData.filters
        const filter1 = dateDiff(cores.first)
        let lifespan1 = parseInt(100 - 100 * filter1 / 190)
        if (lifespan1 < 0) lifespan1 = 0
        const filter2 = dateDiff(cores.second)
        let lifespan2 = parseInt(100 - 100 * filter2 / 375)
        if (lifespan2 < 0) lifespan2 = 0
        const filter3 = dateDiff(cores.third)
        let lifespan3 = parseInt(100 - 100 * filter3 / 555)
        if (lifespan3 < 0) lifespan3 = 0
        if (component) {
          component.setData({
            'filters[0].lifespan': lifespan1,
            'filters[1].lifespan': lifespan2,
            'filters[2].lifespan': lifespan2,
            'filters[3].lifespan': lifespan3,
            'filters[4].lifespan': lifespan3
          })
        }
      }

      // 更新服务时间
      if (chart) {
        const alldays = userData.serviceDays || 365
        const pastdays = dateDiff(userData.serviceStart || today)
        const leftdays = alldays - pastdays
        chart.setOption({
          series: [{
            max: alldays,
            data: [{
              value: pastdays
            }]
          }]
        })
        console.log(leftdays)
        component.setData({
          leftdays: leftdays,
          quality1,
          quality2
        })
      }
    }
  }
})
