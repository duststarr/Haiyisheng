
/**
 * 微信小程序全局数据助手
 * 
 * by:duststarr
 * at:2020-06-03 09:23:05
 */


let _app;

export default function globalInit(app) {
    _app = app;
    /**
     * 手动触发更新
     * @param {*} name 
     */
    app.globalEmit = function (name) {
        if (app.globalData._watches && app.globalData._watches[name]) {
            app.globalData._watches[name].forEach(func => {
                func(app.globalData[name])
            })
        }
    }
    /**
     * 订阅全局变量的变更
     * @param {*} name 
     * @param {*} callback 
     * @param {*} callAtonce 如果有值是否立即回调
     */
    app.globalWatch = function (name, callback, callAtonce = true) {
        if (!app.globalData._watches)
            app.globalData._watches = {}
        if (!app.globalData._watches[name])
            app.globalData._watches[name] = []
        app.globalData._watches[name].push(callback)
        if (callAtonce && app.globalData[name])
            callback(app.globalData[name])
    }
}
