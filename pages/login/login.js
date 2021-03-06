let { Tool, RequestFactory, Storage } = global

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSee:false
  },
  onLoad: function (options) {
    this.setData({
      isBack: options.isBack
    })
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
      Tool.loginOpt(req)
      if (this.data.isBack) {
        Tool.navigationPop()
      } else {
        Tool.switchTab('/pages/index/index')
      }
    }
    Tool.showErrMsg(r)
    r.addToQueue();
  },
})