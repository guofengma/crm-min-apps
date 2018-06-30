let { Tool, RequestFactory } = global;

Page({
  data: {
    getCodeBtEnable: true,
    second: '59',
    showSecond: false,
    time: Object,
    disabled: true,
    phone: '',
    pwd: '',
    code: '',
    isSee: false
  },
  onLoad: function (options) {
    this.setData({
      phone: options.phone
    })
  },
  onShow: function () {

  },
  isSeePwd() {
    this.setData({
      isSee: !this.data.isSee
    })
  },
  formSubmit(e) {
    if (!Tool.checkPwd(this.data.pwd)) {
      Tool.showAlert("密码格式不正确");
      return
    }
    let params = e.detail.value
    params.phone = this.data.phone
    let r = RequestFactory.resetPassword(params);
    r.finishBlock = (req) => {
      Tool.redirectTo('/pages/login/login')
    };
    r.addToQueue();
  },
  changeInput(e) {
    let n = parseInt(e.currentTarget.dataset.index)
    switch (n) {
      case 1:
        this.setData({
          code: e.detail.value
        });
        break;
      case 2:
        this.setData({
          pwd: e.detail.value
        });
        break;
    }
    this.isBtnDisabled()
  },
  isBtnDisabled: function () {
    if (!( Tool.isEmptyStr(this.data.pwd) || Tool.isEmptyStr(this.data.code))) {
      this.setData({
        disabled: false
      });
    } else {
      this.setData({
        disabled: true
      });
    }
  },
  getCodeTap: function () { // 获取验证码
    if (!Tool.checkPhone(this.data.phone)) {
      Tool.showAlert("请输入正确的手机号");
      return
    }
    let tempEnable = this.data.getCodeBtEnable;
    if (!tempEnable) {
      return;
    }
    this.setData({
      getCodeBtEnable: !tempEnable,
      showSecond: true
    });
    this.countdown(this);
    let r = RequestFactory.sendUserUpdateCode({ phone: this.data.phone});
    r.finishBlock = (req) => {
      wx.showToast({
        title: '验证码已发送',
      })
    };
    r.addToQueue();
  },
  countdown: function (that) { // 倒计时
    let second = that.data.second;
    clearTimeout(this.data.time);
    if (second == 0) {
      that.setData({
        second: '59',
        getCodeBtEnable: true,
        showSecond: false
      });
      return;
    }
    var time = setTimeout(function () {
      that.setData({
        second: second - 1,
        getCodeBtEnable: false,
        showSecond: true,
      });
      that.countdown(that);
    }, 1000)
    that.setData({
      time: time
    });
  },
})