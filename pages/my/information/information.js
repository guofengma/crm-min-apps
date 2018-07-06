// pages/my/account.js
let { Tool, RequestFactory, Storage, Event } = global
Page({
    data: {
        isNew:false
    },
    onLoad: function (options) {
    },
    onShow: function () {
    },
    didLogin(){
      if (!Tool.didLogin(this)){
        Tool.navigateTo('/pages/login/login-wx/login-wx')
        return false
      }
      return true
    },
    //跳到通知页面
    notice() {
      if (!this.didLogin()) return
      Tool.navigateTo('notice/notice')
    },
    //跳到消息页面
    information() {
      if (!this.didLogin()) return
      Tool.navigateTo('information/information')
    },
    //跳到拼店消息页面
    groupInformation() {
      if (!this.didLogin()) return
      Tool.navigateTo('groupInformation/groupInformation')
    },

    onUnload: function () {
    },
})