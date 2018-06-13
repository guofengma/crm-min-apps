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
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    let params = e.detail.value
    let r = RequestFactory.findMemberByPhone(params);
    r.finishBlock = (req) => {
      console.log(req)
    }
    // r.addToQueue();
  },
})