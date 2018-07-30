let { Tool, RequestFactory, Storage } = global;

Page({
  data: {
    getCodeBtEnable: true,
    second: '59',
    showSecond: false,
    time: Object,
    disabled:true,
    phone:'',
    pwd:'',
    code:'',
    isSee: false,
    id:'', // 保存邀请码（扫描分享和点击分享页面分享）
    userInfo:'', //用户头像等信息
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    invalidTips:{
      invalid:false,
      tips:''
    },
  },
  onLoad: function (options) {
    this.setData({
      id: options.id || '',
      userInfo: Storage.wxUserInfo() || false
    })
    if (options.id){
      this.sweepCode(options.id)
    }
  },
  onShow: function () {
    
  },
  sweepCode(id){
    let params = {
      id:id
    }
    let r = RequestFactory.sweepCode(params);
    r.finishBlock = (req) => {
      
    }
    r.failBlock = (req) => {
      let msg = req.responseObject.msg
      if (req.responseObject.code == 600) {
        this.setData({
          invalidTips: {
            invalid: true,
            tips: msg
          }
        })
      } else {
        Tool.showAlert(msg)
      }
    }
    r.addToQueue();
  },
  isSeePwd() {
    this.setData({
      isSee: !this.data.isSee
    })
  },
  formSubmit(e) {
    if (!Tool.checkPhone(this.data.phone)) {
      Tool.showAlert("请输入正确的手机号");
      return
    }
    if (!Tool.checkPwd(this.data.pwd)) {
      Tool.showAlert("密码格式不正确");
      return
    }
    let params = {
      phone: this.data.phone,
      code: this.data.code,
      password: this.data.pwd
    }
    // this.verifyPhone(e.detail.value)  // 改动了 
    this.verifyPhone(params)
  },
  verifyPhone(params){
    let r = RequestFactory.findMemberByPhone(params);
    r.finishBlock = (req) => {
      Tool.navigateTo('/pages/register/register-code/register-code?phone=' + this.data.phone + "&password=" + this.data.pwd+'&id='+this.data.id)
    }
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  changeInput(e){
    let n = parseInt(e.currentTarget.dataset.index)
    switch (n) {
      case 1:
        this.setData({
          phone: e.detail.value
        });
        break;
      case 2:
        this.setData({
          code: e.detail.value
        });
        break;
      case 3:
        this.setData({
          pwd: e.detail.value
        });
        break;
    }
    this.isBtnDisabled()
  },
  isBtnDisabled: function(){
    if(!(Tool.isEmptyStr(this.data.phone) || Tool.isEmptyStr(this.data.pwd) || Tool.isEmptyStr(this.data.code))){
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
    if (!Tool.checkPhone(this.data.phone)){
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
    let r = RequestFactory.sendRegistrationCode(this.data.phone);
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
    let time = setTimeout(function () {
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
  agreeGetUser(e) {
    if (!this.data.canIUse) {
      this.getUserInfo()
    }
    if (e.detail.userInfo !== undefined) {
      this.setData({
        userInfo: e.detail.userInfo
      })
      Storage.setWxUserInfo(e.detail.userInfo)
      this.formSubmit()
    } 
  },
  getUserInfo() {
    wx.getUserInfo({
      success: res => {
        this.setData({
          userInfo: e.detail.userInfo
        })
        Storage.setWxUserInfo(e.detail.userInfo)
        this.formSubmit()
      },
      fail: function () {
       
      }
    })
  },
  toLogin(){
    Tool.navigateTo('/pages/login/login')
  }
})