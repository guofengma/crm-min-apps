// pages/my/account.js
let { Tool, RequestFactory, Storage, Event } = global
Page({
    data: {
    },
    onLoad: function (options) {

    },
    onShow: function () {

    },

    didLogin(){
      if (!Tool.didLogin(this)){
        Tool.navigateTo('/pages/login/login-wx/login-wx');
        return false
      }
      return true
    },

    onUnload: function () {

    },
})