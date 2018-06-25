let { Tool, RequestFactory } = global

Page({
  data: {
    active: true
  },
  onLoad: function (options) {

  },
  onShow: function () {

  },
  newAddress(){
    Tool.navigateTo('/pages/address/new-address/new-address')
  }
})