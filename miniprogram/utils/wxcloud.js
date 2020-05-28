export default async function wxcloud( action, data = {}) {
    return new Promise(function (resolve, reject) {
        data.action = action
        wx.showLoading({title:'加载中...'})
        wx.cloud.callFunction({
            name: 'haiyisheng',
            data: data,
            success: res => {
                wx.hideLoading()
                resolve(res)
            },
            fail: () => {
                wx.hideLoading()
                resolve({ msg: 'error' })
            }
        })
    })
}