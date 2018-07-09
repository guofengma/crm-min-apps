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
    url:'https://dnlcrm.oss-cn-beijing.aliyuncs.com/xcx/',
    classify:[
      { name: '美容美妆', imgurl:'index-icon-1.png'},
      { name: '包包', imgurl: 'index-icon-2.png' },
      { name: '鞋子', imgurl: 'index-icon-3.png' },
      { name: '服饰', imgurl: 'index-icon-4.png' },
    ],
    recommendImgUrl:[
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    topicImgUrl: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ]
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
