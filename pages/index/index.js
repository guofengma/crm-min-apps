//index.js
//获取应用实例
const app = getApp()

let { Tool, RequestFactory } = global;

Page({
  data: {
    
  },
  onLoad: function () {
    
  },
  btnClicked: function(e) {
    let page = e.currentTarget.dataset.id
    Tool.navigateTo(page)
  },
  // requestInfo: function () {
  //   let self = this;
  //   let r = RequestFactory.Login();
  //   r.finishBlock = (req) => {
  //     //console.log(req)
  //   }
  //   r.addToQueue();
  // }
})
