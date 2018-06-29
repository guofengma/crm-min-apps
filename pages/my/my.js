// pages/my/account.js
let { Tool, RequestFactory, Storage, Event } = global
Page({
    data: {
      userInfos:''
    },
    onLoad: function (options) {
      this.refreshMemberInfoNotice()
      Event.on('refreshMemberInfoNotice', this.refreshMemberInfoNotice, this);
    },
    refreshMemberInfoNotice(){
      Tool.getUserInfos(this)
    },
    //跳到我的订单页面
    allOrder(e) {
      let index = e.currentTarget.dataset.index;
      Tool.navigateTo('my-order/my-order?index=' + index)
    },
    //跳到我的账户页面
    myAccount() {
      Tool.navigateTo('my-account/my-account')
    },
    myCollection() {
      Tool.navigateTo('/pages/my/my-collection/my-collection')
    },
    //跳到我的信息页面
    personalData() {
      Tool.navigateTo('my-personalData/my-personalData')
    },
    //跳到设置页面
    setting() {
      Tool.navigateTo('setting/setting')
    },
    onUnload: function () {
      Event.off('refreshMemberInfoNotice', this.refreshMemberInfoNotice);
    },
})