// pages/my/account.js
let { Tool, RequestFactory, Storage, Event } = global
Page({
    data: {
        status:3
    },
    onLoad: function (options) {

    },
    onShow: function () {

    },
    //订单疑问
    order(){
        if (!this.didLogin()) return;
        Tool.navigateTo('../../help-customer/help-customer')
    },
    //投诉
    feedback(){
        if (!this.didLogin()) return;
        Tool.navigateTo('../../help-customer/questionFeedback/questionFeedback')
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