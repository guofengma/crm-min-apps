let { Tool, RequestFactory, Event, Storage } = global

Page({
  data: {
    code:'',//物流单号
    phone:'', //手机号
  },
  onLoad: function (options) {
  
  },
  onCodeClickListener: function () {
    wx.scanCode({
      success: (res) => {
        let result = res.result;
        if (result.length > 0) {
         this.setData({
           code: result
         })
        }
      }
    })
  },
  inputOnCodechange(e){
    this.setData({
      code: e.detail
    })
  },
  inputOnPhonechange(e) {
    this.setData({
      phone: e.detail
    })
  },
})