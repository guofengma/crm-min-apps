//app.js
import TCGlobal, {
  Storage,
  Tool,
  Event,
  Touches,
  RequestFactory
} from './tools/tcglobal';

App({
  onLaunch: function () {
    //设置全局变量
    global.TCGlobal = TCGlobal;
    global.Storage = Storage;
    global.Tool = Tool;
    global.Event = Event;
    global.Touches = Touches;
    global.RequestFactory = RequestFactory;

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        let code = res.code
        console.log(code)
        if(code){
          wx.request({
            url: 'https://api.weixin.qq.com/sns/jscode2session',
            data: {
              //小程序唯一标识
              appid: global.TCGlobal.AppId,
              //小程序的 app secret
              secret: global.TCGlobal.Secret,
              grant_type: 'authorization_code',
              js_code: res.code
            },
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              console.log(res.data.openid) 
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      } 
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})