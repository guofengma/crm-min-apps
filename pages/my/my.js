// pages/my/account.js
let { Tool, RequestFactory, Storage, Event } = global
Page({
    data: {
      userInfos:'',
      tabClicked:0
    },
    onLoad: function (options) {
      this.refreshMemberInfoNotice()
      this.didLogin()
      Event.on('refreshMemberInfoNotice', this.refreshMemberInfoNotice, this);
      Event.on('didLogin', this.didLogin, this);
    },
    onShow: function () {
      this.setData({
        tabClicked: 1
      })
    },
    refreshMemberInfoNotice(){
      Tool.getUserInfos(this)
    },
    onTabItemTap(item) {
      let num = this.data.tabClicked
      // 阻止多次点击跳转
      if (num==1){
        this.didLogin()
      } 
      this.setData({
        tabClicked: 2
      })
    },
    didLogin(){
      if (!Tool.didLogin(this)){
        Tool.navigateTo('/pages/login/login-wx/login-wx')
        return false
      }
      return true
    },
    //跳到我的订单页面
    allOrder(e) {
      if (!this.didLogin()) return
      let index = e.currentTarget.dataset.index;
      if(index==4){
        Tool.navigateTo('/pages/after-sale/my-after-sale/my-after-sale')
        return
      }
      Tool.navigateTo('my-order/my-order?index=' + index)
    },
    //跳到我的账户页面
    myAccount() {
      if (!this.didLogin()) return
      Tool.navigateTo('my-account/my-account')
    },
    myCollection() {
      if (!this.didLogin()) return
      Tool.navigateTo('/pages/my/my-collection/my-collection')
    },
    //跳到我的信息页面
    personalData() {
      if (!this.didLogin()) return
      Tool.navigateTo('my-personalData/my-personalData')
    },
    //跳到设置页面
    setting() {
      if (!this.didLogin()) return
      Tool.navigateTo('setting/setting')
    },
    //跳到帮助与客服页面
    helpCustomer() {
      if (!this.didLogin()) return
      Tool.navigateTo('help-customer/help-customer')
    },
    //我的消息
    information() {
      if (!this.didLogin()) return
      Tool.navigateTo('information/information')
    },
    //我的通讯录
    addressList() {
      if (!this.didLogin()) return
      Tool.navigateTo('addressList/addressList')
    },
    //邀请
    invite() {
      if (!this.didLogin()) return
      Tool.navigateTo('invite/invite')
    },
    onUnload: function () {
      Event.off('refreshMemberInfoNotice', this.refreshMemberInfoNotice);
      Event.off('didLogin', this.didLogin);
    },
})