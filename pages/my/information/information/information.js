// pages/my/account.js
let { Tool, RequestFactory, Storage, Event } = global
Page({
    data: {


    },
    //跳到详情页
    informationDetail(){
        if (!this.didLogin()) return
        Tool.navigateTo('../informationDetail/informationDetail')
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

    onUnload: function () {

    },
})