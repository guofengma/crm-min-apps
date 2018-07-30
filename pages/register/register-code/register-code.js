let { Tool, RequestFactory, Storage } = global;
Page({
  data: {
    isAgree:false,
    invite:[],
    inviteId:'',
    code:'',
    userInfo:'',
    openid:'',
    num:4, // 请求推荐人的个数
    disabled:false
  },
  onLoad: function (options) {
    this.setData({
      accoutInfo: options,
      userInfo: Storage.wxUserInfo() || false,
      openid: Storage.getWxOpenid() || '',
    })
    if (!options.id){
      this.queryInviterList() // 请求邀请者
    } else {
      this.initInputValue() // 初始化input的值
    }
    
  },
  onShow: function () {

  },
  initInputValue(){
    this.setData({
      code: this.data.accoutInfo.id,
      disabled:true,
      inviteId: this.data.accoutInfo.id
    })
  },
  inputChange(e){
    this.setData({
      code:e.detail.value
    })
  },
  requetSignMember() {
    let params = {
      "phone": this.data.accoutInfo.phone,
      'password': this.data.accoutInfo.password,
      'inviteId': this.data.accoutInfo.id || '', // 邀请者id 
      'headImg': this.data.userInfo.avatarUrl,
      'nickname': this.data.userInfo.nickName,
      'openid': this.data.openid,
    };
    // 如果不是被邀请的 那么就取授权码
    if (!this.data.accoutInfo.id){
      params.code = this.data.code
    }
    let r = RequestFactory.signMember(params);
    r.finishBlock = (req) => {
      Storage.setMemberId(req.responseObject.data.id)
      Tool.loginOpt(req)
      Tool.navigateTo('/pages/real-name/real-name')
    }
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  formSubmit(e){
    if(Tool.isEmptyStr(e.detail.value.id)){
      Tool.showAlert('请输入会员ID或选择一个邀请者')
      return
    }
    if (!this.data.isAgree){
      Tool.showAlert('请勾选用户协议')
      return
    }
    this.requetSignMember()
  },
  agreeCilcked(){
    this.setData({
      isAgree:!this.data.isAgree
    })
  },
  queryInviterList(){
    let r = RequestFactory.queryInviterList({ amount:this.data.num});
    r.finishBlock = (req) => {
      this.setData({
        invite: req.responseObject.data
      })
    }
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  inviterClicked(e){
    let id = e.currentTarget.dataset.key
    this.setData({
      code: id || ''
    })
  }
})