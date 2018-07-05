let { Tool, RequestFactory, Storage } = global;
Page({
  data: {
    isAgree:false,
    invite:[],
    inviteId:'',
    userInfo:'',
    openid:'',
    num:4, // 请求推荐人的个数
  },
  onLoad: function (options) {
    console.log(options)
    this.setData({
      accoutInfo: options,
      userInfo: Storage.wxUserInfo(),
      openid: Storage.getWxOpenid()
    })
    this.queryInviterList()
  },
  onShow: function () {

  },
  requetSignMember() {
    let params = {
      "phone": this.data.accoutInfo.phone,
      'password': this.data.accoutInfo.password,
      'inviteId': this.data.inviteId,
      'headImg': this.data.userInfo.avatarUrl,
      'nickname': this.data.userInfo.nickName,
      'openid': this.data.openid
    };
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
      inviteId: id
    })
  }
})