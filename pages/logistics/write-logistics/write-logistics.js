let { Tool, RequestFactory, Storage, Event } = global

Page({
  data: {
    code:'',//物流单号
    phone:'', //手机号
    company:{id:"",name:''}
  },
  onLoad: function (options) {
    this.setData({
      list: Storage.getAfterSaleList() || ''
    })
    Event.on('updateCompany', this.updateCompany,this)
  },
  updateCompany(){
    this.setData({
      company: Storage.getExpressCom()
    })
  },
  fillInExpressInfoById() {
    let list = this.data.list
    let params = {
      backAddress: list.returnAddress.address,
      backPhone: list.returnAddress.recevicePhone,
      backReceiver: list.returnAddress.receiver,
      expressName: this.data.company.id,
      expressNo:this.data.code,
      receiveAddress: list.receive.address,
      receivePhone:list.receive.recevice_phone,
      receiver: list.receive.receiver,
      returnProductId: list.returnProduct.id,
    };
    let r = RequestFactory.fillInExpressInfoById(params)
    r.finishBlock = (req) => {
      Storage.setExpressNo(this.data.code)
      Event.emit('updataExpressNo')
      Tool.navigationPop()
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
  inputOnchange(e){
    this.setData({
      code: e.detail.value
    })
  },
  logLineClicked(){
    Tool.navigateTo('/pages/logistics/choose-logistics/choose-logistics')
  },
  onUnload: function () {
    Event.off('updateCompany', this.updateCompany)
  },
})