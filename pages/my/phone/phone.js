let { Tool, RequestFactory, Event, Storage} = global;
Page({
  data: {
    ysf: { title: '修改手机号' },
    isNext: false,
    isTime: false,
    phone: '',
    getCodeBtEnable: true,
    second: '59',
    showSecond: false,
    time: Object,
    disabled: true,
    code: "",
  },
  onLoad: function (options) {

  },
  //下一步
  next() {
    if (Tool.isEmptyStr(this.data.phone)){
      Tool.showAlert("手机号不能为空");
      return
    }
    if (!Tool.checkPhone(this.data.phone)) {
        Tool.showAlert("请输入正确的手机号");
        return
    }
    if (Tool.isEmptyStr(this.data.code)) {
        Tool.showAlert("请输入验证码");
        return
    }
    this.setData({
        isNext: true
    })
  },
  //确定
  sure() {
    let params = {
        code: this.data.code,
        phone: this.data.phone
    }
    let r = RequestFactory.updateDealerNewPhone(params);
    r.finishBlock = (req) => {
        Storage.setUserAccountInfo(req.responseObject.data)
        Event.emit('refreshMemberInfoNotice');
        this.cancel();
        Tool.redirectTo('../account/account')
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  // 取消
  cancel() {
    this.setData({
        isNext: false
    })
  },
  changeInput(e) {
    this.setData({
        code: e.detail.value
    })
  },
  changePhone(e) {
      this.setData({
          phone: e.detail.value
      })
  },
  getCodeTap() {
    if (!Tool.checkPhone(this.data.phone)) {
        Tool.showAlert("请输入正确的手机号");
        return
    }
    let params = {
      code: 'MOBILE_VERIFYNEWPHONE_CODE',
      phone: this.data.phone
    }
    
    let callBack = () => {
      let r = RequestFactory.sendMessage(params);
      // let r = RequestFactory.sendUserNewPhoneCode(params);
      r.finishBlock = (req) => {
          wx.showToast({
              title: '验证码已发送',
          })
      };
      Tool.showErrMsg(r)
      r.addToQueue();
    }
    Tool.codeEnable(this, callBack)
  },
})