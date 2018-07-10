//index.js
//获取应用实例
const app = getApp()

let { Tool, RequestFactory } = global;

Page({
  data: {
    imgUrls: [],
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
    this.queryAdList()
    this.queryFeaturedList()
  },
  queryAdList(){
    let r = RequestFactory.queryAdList(1);
    r.finishBlock = (req) => {
      this.setData({
        imgUrls: req.responseObject.data
      })
    };
    r.addToQueue();
  },
  adListClicked(e){
    let adType = e.currentTarget.dataset.type
    let val = e.currentTarget.dataset.val
    let page = ''
    if (adType==1){
      page = '/pages/product-detail/product-detail?prodCode=' + val
    } else if (adType == 2){

    }
    Tool.navigateTo(page)
  },
  queryFeaturedList(){
    let params = {
      linkType:1,
      pageType:1,
    }
    let r = RequestFactory.queryFeaturedList(params);
    r.finishBlock = (req) => {
      let data = req.responseObject.data ? req.responseObject.data : []
      this.setData({
        recommendImgUrl: req.responseObject.data
      })
    };
    r.addToQueue();
  },
  topicList(){
    let params = {
      page:0,
      size:1
    }
    let r = RequestFactory.topicList(params);
    r.finishBlock = (req) => {
      let data = req.responseObject.data ? req.responseObject.data:[]
      this.setData({
        topicImgUrl: req.responseObject.data
      })
    };
    r.addToQueue();
  },
  searchClicked(){
    Tool.navigateTo('/pages/search/search')
  },
  msgClicked(){
    Tool.navigateTo('/pages/my/information/information')
  },
  onShareAppMessage: function (res) {

  }
})
