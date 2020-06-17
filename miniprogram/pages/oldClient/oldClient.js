// miniprogram/pages/oldClient/oldClient.js
import util from '../../utils/util.js'
const app = getApp()
const db = wx.cloud.database()
const db_oldclient = db.collection('oldclient')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    years: ['一年', '两年', '三年', '四年', '五年'],
    type: 'none',

    _id: null,
    _openid: null,
    address: null,
    serviceYears: 0,
    date0: '2020-06-01',
    date1: '2020-06-01',
    date2: '2020-06-01',
    date3: '2020-06-01',
    done: false
  },
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: async function (options) {
    const that = this
    app.globalWatch('userDetail', async function (detail) {
      /**
       * type四种情况：
       * admin:管理员管理
       * client:不是管理员管理，但已经是会员
       * waiting:已申请,等待审核
       * none: 其它情况
       */
      if (detail.isAdmin && app.globalData.oldclient) {
        //管理员管理
        const old = app.globalData.oldclient;
        that.setData({
          ...old,
          type: 'admin'
        })
      }
      else if (!detail.isClient) {
        // 个人申请
        const res = await db_oldclient.where({
          done: false
        }).get()
        if (res.data.length > 0) {
          const info = res.data[0]
          that.setData({
            ...info,
            type: 'waiting'
          })
        }
      }
      else if (detail.isClient) {
        // 已经是会员
        that.setData({
          type: 'client'
        })
      }
    })
  },

  onChooseAddress: async function (e) {
    this.setData({
      address: e.detail
    })
  },
  onYearsChange: function (e) {
    this.setData({
      serviceYears: e.detail.value
    })
  },
  onDateChange: function (e) {
    const date = e.detail.value
    const pos = e.currentTarget.dataset.pos;
    const which = 'date' + pos;
    this.setData({
      [which]: date
    })
  },

  onSubmit: async function (e) {
    const that = this
    wx.showModal({
      title: '提交',
      context: '确认信息并提交？',
      success(res) {
        if (res.confirm) {
          if ('admin' == that.data.type) {
            app.globalData.oldclient = null
            app.wxcloud('acceptOldclient', that.data).then(res => {
              wx.showToast({
                title: '成功',
                icon: 'none',
                duration: 2000,
                success: () => {
                  setTimeout(wx.navigateBack, 2000)
                }
              })
            })
          }
          else {
            db_oldclient.add({
              data: {
                address: that.data.address,
                serviceYears: that.data.serviceYears,
                date0: that.data.date0,
                date1: that.data.date1,
                date2: that.data.date2,
                date3: that.data.date3,
                done: false
              }
            }).then(() => {
              that.setData({
                type: 'waiting'
              })
            })
          }
        }
      }
    })
  },
  onReject: function (e) {
    const that = this
    wx.showModal({
      title: '拒绝申请',
      context: '确定不是老会员？',
      success(res) {
        if (res.confirm) {
          app.wxcloud('rejectOldclient', that.data).then(res => {
            wx.navigateBack();
          })
        }
      }
    })
  }
})