let { Tool, RequestFactory} = global

Page({

  /**
   * 页面的初始数据
   */
  data: {
    show:false, //展示形式  false：网状 
    keyword:'', 
    tipVal:'', // 默认是无 取值 1 2 3 
  },
  onLoad: function (options) {
    console.log(options)
    this.setData({
      keyword:options.keyword
    })
  },
  onShow: function () {
    
  },
  onScroll(){
    // 向下滑动的时候请求数据
  },
  productCliked(e){
    console.log(e.currentTarget.dataset.index)
    Tool.navigateTo('/pages/product-detail/product-detail?')
  },
  navbarClicked(e){
    let n = e.detail
    switch (n) {
      case 1:
      
        break;
      case 2:
        
        break;
      case 3:
        
        break;
      default:
        this.setData({
          show: n
        })  
    }
  }
})