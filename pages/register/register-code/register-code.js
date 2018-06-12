// pages/register/register-code.js
Page({
  data: {
    isAgree:false
  },
  onLoad: function (options) {
  
  },
  onShow: function () {
  
  },
  agreeCilcked(){
    this.setData({
      isAgree:!this.data.isAgree
    })
  }
})