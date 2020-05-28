export default async function wxcloud( action, data = {}) {
    return new Promise(function (resolve, reject) {
        data.action = action
        wx.showLoading({title:'加载中...'})
        console.log('wxcloud:',data.action,data)
        wx.cloud.callFunction({
            name: 'haiyisheng',
            data,
            success: res => {
                console.log('wxcloud success:',res)
                wx.hideLoading()
                resolve(res)
            },
            fail: (e) => {
                console.log('wxcloud fail:',e)
                wx.hideLoading()
                resolve({ msg: 'error' })
            }
        })
    })
}