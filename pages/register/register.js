// pages/register/register.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    getCodeBtEnable: true,
    second: '59',
    showSecond: false,
    time: Object,
    disabled:true
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
  formSubmit(e){
    console.log(e.detail)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },
  getCodeTap: function () { // 获取验证码
    let tempEnable = this.data.getCodeBtEnable;
    if (!tempEnable) {
      return;
    }
    console.log('gecode')
    this.setData({
      getCodeBtEnable: !tempEnable,
      showSecond: true
    });

    this.countdown(this);
    // let r = RequestWriteFactory.verifyCodeGet(this.data.phone, '1');
    // r.finishBlock = (req) => {
    //   wx.showToast({
    //     title: '验证码已发送',
    //   })
    // };
    // r.addToQueue();
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