let { Tool, RequestFactory } = global;

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
    this.setData({
      hidden: e.detail
    })
  },
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },
  bindChange(e){
    console.log(e.detail.value)
    this.setData({
      citys: this.data.city[e.detail.value[0]]
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
    let info = e.detail.value
    if (!Tool.checkIdentityCode(info.IDcard)) {
      Tool.showAlert("请输入正确的中文姓名");
      return
    }
    if (!Tool.checkIdentityCode(info.IDcard)){
      Tool.showAlert("请输入正确的身份证号");
      return 
    }
    if (!Tool.checkIdentityCode(info.IDcard)) {
      Tool.showAlert("请输入正确的身份证号");
      return
    }
    if (!Tool.isEmptyStr(this.data.address)) {
      Tool.showAlert("请输入详细地址");
      return
    }
  },
  dimiss(){
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  open(){
    this.setData({
      show: !this.data.show
    })
  }
})