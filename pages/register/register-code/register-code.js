let { Tool, RequestFactory } = global;
Page({
  data: {
    isAgree:false
  },
  onLoad: function (options) {
  
  },
  onShow: function () {
  
  },
  formSubmit(e){
    console.log(e.detail.value.id)
    if(Tool.isEmptyStr(e.detail.value.id)){
      return
    }
    Tool.navigateTo('/pages/real-name/real-name')
  },
  agreeCilcked(){
    this.setData({
      isAgree:!this.data.isAgree
    })
  }
})