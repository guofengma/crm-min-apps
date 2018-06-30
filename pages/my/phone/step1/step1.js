let { Tool, RequestFactory, Event } = global
Page({

  /**
   * 页面的初始数据
   */
  data: {
    getCodeBtEnable: true,
    second: '59',
    showSecond: false,
    time: Object,
    disabled: true,
    code:"",
  },
  onLoad: function (options) {
    this.refreshMemberInfoNotice()
    Event.on('refreshMemberInfoNotice', this.refreshMemberInfoNotice, this);
  },
  refreshMemberInfoNotice() {
    Tool.getUserInfos(this)
  },
  onUnload: function () {
    Event.off('refreshMemberInfoNotice', this.refreshMemberInfoNotice);
  },
  changeInput(e){
    this.setData({
      code: e.detail.value
    })
  },
  getCodeTap () {
    let callBack = ()=>{
      let r = RequestFactory.sendUserPhoneCode({ phone: this.data.userInfos.phone });
      r.finishBlock = (req) => {
        wx.showToast({
          title: '验证码已发送',
        })
      };
      r.addToQueue();
    }
    Tool.codeEnable(this, callBack)
  },
  next(){
    if (Tool.isEmptyStr(this.data.code)) {
      Tool.showAlert("请输入验证码");
      return
    } 
    let r = RequestFactory.updateDealerPhone({ code: this.data.code });
    r.finishBlock = (req) => {
      Tool.redirectTo('/pages/my/phone/phone?phone=' + this.data.userInfos.phone)
    };
    r.failBlock = (req) => {
      Tool.showAlert(req.responseObject.msg)
    }
    r.addToQueue();
  }
})