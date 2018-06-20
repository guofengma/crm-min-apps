// pages/product-detail/product-detail.js
Page({
  data: {
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    activeIndex:1, // 轮播图片的index 
    show:true
  },
  onLoad: function (options) {
  
  },
  onShow: function () {
  
  },
  sliderChange(e){
    this.setData({
      activeIndex: e.detail.current+1
    })
  },
  infoChoose(e){
    let show = e.currentTarget.dataset.show ==1 ?  true:false
    this.setData({
      show: show
    })
  }
})