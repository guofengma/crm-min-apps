let { Tool, RequestFactory } = global;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSee:false
  },
  onLoad: function (options) {
  
  },
  onShow: function () {

  },
  isSeePwd(){
    this.setData({
      isSee:!this.data.isSee
    })
  },
  goPage(e){
    let n = e.currentTarget.dataset.id
    let page = n == 1 ? '/pages/register/register' :'/pages/find-password/step1/step1'
    Tool.navigateTo(page)
  },
  formSubmit: function (e) {
    let params = e.detail.value
    let r = RequestFactory.passwordLogin(params);

    r.finishBlock = (req) => {
      
      // 获取 cookies
      let cookies = req.header['Set-Cookie']
      // 存相关信息
      Tool.formatCookie(cookies)

      wx.switchTab({
        url: '/pages/index/index'
      })
    }

    r.failBlock = (req) => {
      Tool.showAlert(req.responseObject.msg)
    }
    r.addToQueue();
  },
})