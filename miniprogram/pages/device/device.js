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
        formatter: '{value}%'
      },
      axisLine: {
        show: true,
        lineStyle: {
          width: 30,
          shadowBlur: 0,
          color: [
            [0.3, '#67e0e3'],
            [0.7, '#37a2da'],
            [1, '#fd666d']
          ]
        }
      },
      data: [{
        value: 40,
        name: '完成率',
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
  attached:function() {
    let that = this;
    setTimeout(function() {
      that.setData({
        loading: true
      })
    }, 500)
  },
  data: {
    cardCur: 0,
    ColorList: app.globalData.ColorList,
    ec: {
      onInit: initChart
    }
  }
})
