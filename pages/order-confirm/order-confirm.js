let { Tool, RequestFactory } = global

Page({

  /**
   * 页面的初始数据
   */
  data: {
    innerCount:1
  },
  onLoad: function (options) {
    
  },
  onShow: function () {
  
  },
  adressClicked(){
    Tool.navigateTo('/pages/address/choose-address/choose-address')
  }
})