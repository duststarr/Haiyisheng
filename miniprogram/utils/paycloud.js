export default async function paycloud(content, amount) {
    const nonceStr = Math.random().toString(36).substr(2, 15)
    const timeStamp = parseInt(Date.now() / 1000) + ''
    const outTradeNo = "hys" + nonceStr + timeStamp.substr(0, 12)

    try {
        const prepay = await wx.cloud.callFunction({
            name: 'pay',
            data: {
                bodyMsg: content,
                totalFee: 1,//amount * 100,
                nonceStr,
                outTradeNo
            }
        });
        console.log('prepay', prepay)
        if (prepay.result.returnCode == 'SUCCESS' && prepay.result.resultCode == 'SUCCESS') {
            const payment = prepay.result.payment
            const payres = await wx.requestPayment({
                ...payment
            });
            console.log('pay success', payres)
            wx.showToast({
                title: '支付成功',
                icon: 'none',
                duration: 2000
            })
            return {
                nonceStr,
                outTradeNo
            }
        } else {
            return ('pay cloud error')
        }
    } catch (e) {
        console.error(e);
        wx.showToast({
            title: '支付错误',
            icon: 'none',
            duration: 2000
        })
        return ('pay function error')
    }
}