let { Tool, RequestFactory,Storage } = global

Page({
  data: {
    code:'',//物流单号
    phone:'', //手机号
    company:'百事汇通仅为测试'
  },
  onLoad: function (options) {
    this.setData({
      list:Storage.getInnerOrderList() || ''
    })
  },
  fillInExpressInfoById() {
    let params = {
      expressName: this.data.company,
      expressNo: this.data.code,
      returnProductId: this.list.id,
    };
    let r = RequestFactory.fillInExpressInfoById(params)
    r.finishBlock = (req) => {

    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  onCodeClickListener: function () {
    // 扫二维码
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
      code: e.detail.value
    })
  },
  // inputOnPhonechange(e) {
  //   this.setData({
  //     phone: e.detail.value
  //   })
  // },
})