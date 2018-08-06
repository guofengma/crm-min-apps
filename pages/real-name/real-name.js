let { Tool, RequestFactory, Storage } = global

Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: [],
    show:false,
    hidden: false // 解决textarea最高层级的问题 
  },
  pickerClicked(e){
    console.log(e.detail)
    this.setData({
      hidden: e.detail.hidden,
      region: e.detail.result
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },
  formSubmit(e){
    let params = e.detail.value
    // 获取用户ID
    params.id = Storage.memberId()
    console.log(params)
    if (!Tool.checkName(params.realname)) {
      Tool.showAlert("收货人姓名长度需在2-16位之间");
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
    r.addToQueue();
  },
  dismiss(){
    Tool.switchTab('/pages/index/index')
  },
  open(){
    this.setData({
      show: !this.data.show
    })
  }
})