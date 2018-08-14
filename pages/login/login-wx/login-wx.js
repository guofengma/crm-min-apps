let { Tool, RequestFactory, Storage } = global
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:'',
    visiable:false,
    isAgree:false,
    encryptedData:'',
    iv:'',
    openid:'',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isBack:false
  },
  onLoad: function (options) {
    this.setData({
      openid: Storage.getWxOpenid(),
      userInfo: Storage.wxUserInfo(),
      isBack: options.isBack || false
    })
  },
  onShow: function () {
  
  },
  getPhoneNumber(e){
    this.setData({
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv,
    })
    console.log(e.detail.errMsg)
    if (e.detail.errMsg == 'getPhoneNumber:ok') {
      this.setData({
        visiable: !this.data.visiable,
      })
    } else {
      
    }   
  },
  agreeGetUser(e){
    if (!this.data.canIUse){
      this.getUserInfo()
    }
    this.setData({
      visiable: !this.data.visiable
    })
    if (e.detail.userInfo !== undefined){
      this.getLogin(e.detail.userInfo)
    } else {
      this.tips()
    }
  },
  requetLogin(){
    let params ={
      encryptedData: this.data.encryptedData,
      iv: this.data.iv,
      openid: this.data.openid,
      nickname: this.data.userInfo.nickName,
      headImg: this.data.userInfo.avatarUrl
    }
    let r = global.RequestFactory.wechatLogin(params);
    r.finishBlock = (req) => {
      // 存相关信息
      Tool.loginOpt(req)
      if (this.data.isBack){
        Tool.navigationPop()
      } else {
        Tool.switchTab('/pages/index/index')
      }
    }
    r.failBlock = (req) => {
      console.log(req)
      if (req.responseObject.code == 600){
        Tool.navigateTo('/pages/register/register')
      } else if (req.responseObject.code == 215){
        Tool.navigateTo('/pages/download-app/download-app?door=1')
      } else {
        Tool.showAlert(req.responseObject.msg)
      }
    }
    r.addToQueue();
  },
  otherLogin(){
    Tool.navigateTo('/pages/login/login')
  },
  getUserInfo(){
    wx.getUserInfo({
      success: res => {
        this.getLogin(res.userInfo)
      },
      fail: function () {
        this.tips()
      }
    })
  },
  getLogin(userInfo){
    this.setData({
      userInfo: userInfo
    })
    Storage.setWxUserInfo(userInfo)
    this.requetLogin()
  },
  tips(){
    wx.showModal({
      title: '用户未授权',
      content: '如需正常使用该小程序功能，请按确定并在授权管理中选中“用户信息”，然后点按确定。最后再重新进入小程序即可正常使用。',
      showCancel: false,
      success: function (resbtn) {
        if (resbtn.confirm) {
          wx.openSetting({
            success: function success(resopen) {
              //  获取用户数据
              // that.checkSettingStatu();
            }
          });
        }
      }
    })
  }
})