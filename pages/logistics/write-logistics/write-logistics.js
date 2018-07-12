let { Tool, RequestFactory,Storage } = global

Page({
  data: {
    code:'',//物流单号
    phone:'', //手机号
    company:'百事汇通仅为测试'
  },
  onLoad: function (options) {
    this.setData({
      list: Storage.getAfterSaleList() || ''
    })
  },
  fillInExpressInfoById() {
    let list = this.data.list
    let params = {
      backAddress: list.returnAddress.address,
      backPhone: list.returnAddress.recevicePhone,
      backReceiver: list.returnAddress.receiver,
      expressName: '45',
      expressNo:'201807151212121212',
      receiveAddress: list.receive.address,
      receivePhone:list.receive.recevice_phone,
      receiver: list.receive.receiver,
      returnProductId: list.returnProduct.id,
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
  logLineClicked(){

  }
  // inputOnPhonechange(e) {
  //   this.setData({
  //     phone: e.detail.value
  //   })
  // },
})