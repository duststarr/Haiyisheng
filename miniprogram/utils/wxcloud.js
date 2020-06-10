export default async function wxcloud( action, data = {}) {
    return new Promise(function (resolve, reject) {
        data.action = action
        wx.showLoading({title:'加载中...'})
        console.log('cloudStart:',data.action,data)
        wx.cloud.callFunction({
            name: 'haiyisheng',
            data,
            success: res => {
                console.log('cloudRetun:',data.action,res)
                wx.hideLoading()
                resolve(res)
            },
            fail: (e) => {
                console.log('cloudFail:',e)
                wx.hideLoading()
                reject({ msg: 'error' })
            }
        })
    })
}