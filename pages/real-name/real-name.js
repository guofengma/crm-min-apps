let { Tool, RequestFactory, Storage } = global

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ysf: { title: '身份信息提交' },
    region: [],
    show:false,
    hidden: false, // 解决textarea最高层级的问题 
    isDismiss:false
  },
  pickerClicked(e){
    this.setData({
      hidden: e.detail.hidden,
      region: e.detail.result
    })
  },
  formSubmit(e){
    let params = e.detail.value
    // 获取用户ID
    params.id = Storage.memberId()
    if (!Tool.checkName(params.realname)) {
      Tool.showAlert("请输入2-16位之间的中文姓名");
      return
    }
    if (!Tool.checkIdentityCode(params.idcard)){
      Tool.showAlert("请输入正确的身份证号");
      return 
    }
    if (this.data.region.length == 0) {
      Tool.showAlert("请选择你所在的省市区");
      return
    }
    params.province = this.data.region[0].zipcode
    if (this.data.region[1]) {
      params.city = this.data.region[1].zipcode
    }
    if (this.data.region[2]) {
      params.area = this.data.region[2].zipcode
    }
    // if (Tool.isEmptyStr(params.address)) {
    //   Tool.showAlert("请输入详细地址");
    //   return
    // }
    this.requestSignMemberInfo(params)
  },
  requestSignMemberInfo(params){
    let r = global.RequestFactory.signMemberInfo(params);
    r.finishBlock = (req) => {
      Storage.setUserAccountInfo(req.responseObject.data)
      Storage.setMemberId(req.responseObject.data.id)
      this.dismiss()
    }
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  dismiss(){
    this.setData({
      isDismiss: true
    })
    let callBack = ()=>{
      Tool.switchTab('/pages/index/index')
    }
    Tool.showSuccessToast('注册成功', callBack)
  },
  onUnload(){
    if (!this.data.isDismiss){
      this.dismiss()
    }
  },
  open(){
    this.setData({
      show: !this.data.show
    })
  }
})