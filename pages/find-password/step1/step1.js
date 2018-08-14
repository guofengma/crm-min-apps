let { Tool, RequestFactory } = global;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled:true,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  onShow: function () {
  
  },
  changeInput(e){
    let disabled = true
    if (Tool.isEmptyStr(e.detail.value)){
      disabled = true
    } else {
      disabled = false
    }
    this.setData({
      disabled: disabled
    })
  }, 
  formSubmit(e){
    if (!Tool.checkPhone(e.detail.value.phone)) {
      Tool.showAlert("请输入正确的手机号");
      return
    }
    // pages/find-password/step2/step2
    Tool.redirectTo('/pages/find-password/step2/step2?phone=' + e.detail.value.phone)
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})