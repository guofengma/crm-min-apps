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
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        let code = res.code
        if(code){
          this.getUserInfos(code)
        }
      } 
    })
  },
  globalData: {
    userInfo: null,
    openid:null,
    code:null,
  },
  getUserInfos(code){
    let self = this 
    self.toLogin(code)
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              global.Storage.setWxUserInfo(res.userInfo)
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
  toLogin(code){
    let self = this;
    let params = {code:code}
    let r = global.RequestFactory.verifyWechat(params);
    r.finishBlock = (req) => {
      Storage.setUserAccountInfo(req.responseObject.data)
    }
    r.failBlock = (req) =>{
      if (req.responseObject.code ==600 ){
        global.Storage.setWxOpenid(req.responseObject.data)
        wx.switchTab({
          url: '/pages/login/login-wx/login-wx'
        })
      }
    }
    r.addToQueue();
  }
})