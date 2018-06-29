//index.js
//获取应用实例
const app = getApp()

let { Tool, RequestFactory } = global;

Page({
  data: {
    
  },
  onLoad: function () {
    if(app.globalData.flag){//退出登录
      Tool.navigationPop();
    }
  },
  searchClicked(){
    Tool.navigateTo('/pages/search/search')
  },
  btnClicked: function(e) {
    let page = e.currentTarget.dataset.id
    Tool.navigateTo(page)
  },
  onShareAppMessage: function (res) {
  }
  // requestInfo: function () {
  //   let self = this;
  //   let r = RequestFactory.Login();
  //   r.finishBlock = (req) => {
  //     //console.log(req)
  //   }
  //   r.addToQueue();
  // }
})
