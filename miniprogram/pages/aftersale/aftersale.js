// miniprogram/pages/aftersale/aftersale.js
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        address: null,
        worktype: '', errmsg: '',
        errmsg: '',
        orders: null
    },
    methods: {

    },
    loadOrders: function () {
        const that = this
        const param = {}
        param.isClient = true

        app.wxcloud('orderGetList', param).then(res => {
            that.setData({
                orders: res.result || null
            })
            console.log(that.data.orders)
        })
    },
    onConfirm: function (e) {
        const orderID = e.currentTarget.dataset.id
        var that = this
        wx.showModal({
            title: '确认完成',
            content: '您申请的服务已完成?',
            success(res) {
                if (res.confirm) {
                    app.wxcloud('orderConfirm', { orderID }).then(res => {
                        that.loadOrders()
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this
        app.globalWatch('userDetail', res => {
            that.setData({
                address: res.address
            })
        })
        this.loadOrders()
    },
    onMove: function () {
        this.setData({
            worktype: '移机'
        })
    },
    onDestroy: function () {
        this.setData({
            worktype: '拆机'
        })
    },
    onExchange: function () {
        this.setData({
            worktype: '换芯'
        })
    },
    onRepair: function () {
        this.setData({
            worktype: '报修'
        })
    },
    onCancel: function () {
        this.setData({
            worktype: '', errmsg: ''
        })
    },
    bindFormSubmit: function (e) {
        console.log(e)
        const that = this
        let param = {}
        param.type = this.data.worktype
        param.address = this.data.address
        switch (this.data.worktype) {
            case '移机': {
                const addr2 = that.selectComponent('#addr2')
                console.log('addr2=', addr2)
                param.addr2 = addr2.data.address
                if (!addr2.data.address || '' == addr2.data.address) {
                    that.setData({
                        errmsg: '请选择要移机目的地'
                    })
                    return;
                }
                param.message = '申请移机'
            }
                break;
            case '拆机': {
                param.message = '申请拆机'
            }
                break;
            case '换芯': {
                const f = e.detail.value.cbFilters
                if (f.length == 0) {
                    that.setData({
                        errmsg: '至少选择一个滤芯'
                    })
                    return;
                }
                param.message = '申请更换滤芯'
                param.message += f.includes('1') ? '1、' : ''
                param.message += f.includes('2') ? '2、' : ''
                param.message += f.includes('3') ? '3、4、5' : ''
                param.message += '号滤芯'
            }
                break;
            case '报修': {
                param.message = '故障描述:' + e.detail.value.problem
            }
                break;
        }
        console.log(param)
        app.wxcloud('orderCreate', param).then(res => {
            console.log(res)
            this.setData({
                worktype: '', errmsg: ''
            })
            this.loadOrders()
        })
    }
})