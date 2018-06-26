let { Tool, RequestFactory } = global

Page({
  data: {
    active: true,
    addressType:1
  },
  onLoad: function (options) {

  },
  onShow: function () {

  },
  newAddress(){
    Tool.navigateTo('/pages/address/new-address/new-address')
  }
})