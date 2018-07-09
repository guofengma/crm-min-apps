//index.js
//获取应用实例
const app = getApp()

let { Tool, RequestFactory } = global;

Page({
  data: {
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
  },
  onLoad: function () {

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
})
