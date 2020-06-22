export default function paycloud(content, amount) {
    return new Promise(function (resolve, reject) {
        const nonceStr = Math.random().toString(36).substr(2, 15)
        const timeStamp = parseInt(Date.now() / 1000) + ''
        const outTradeNo = "hys" + nonceStr + timeStamp.substr(0, 12)
        console.log('paycloud with:', content, amount)
        wx.cloud.callFunction({
            name: 'pay',
            data: {
                bodyMsg: content,
                totalFee: amount * 100,
                nonceStr,
                outTradeNo
            }
        }).then(res => {
            console.log('cloud pay return', res)
            if (res.result.returnCode == 'SUCCESS'
                && res.result.resultCode == 'SUCCESS') {
                const payment = res.result.payment
                wx.requestPayment({
                    ...payment,
                    success(res) {
                        resolve({
                            nonceStr,
                            outTradeNo
                        })
                    },
                    fail(res) {
                        console.error('pay fail', res)
                        reject({ msg: 'requestPayment error' })
                    }
                })
            } else {
                reject(res.result)
            }
        }).catch(err => {
            console.error('cloud call error', err)
            reject({ msg: 'cloud func error' })
        })
    })
}