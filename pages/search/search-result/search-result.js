let { Tool, RequestFactory} = global

Page({

  /**
   * 页面的初始数据
   */
  data: {
    show:false, //展示形式  false：网状 
    keyword:'', 
    tipVal:'', // 默认是无 取值 1 2 3 
    productInfo:[], // 商品信息
    totalPage:'', // 页面总页数
    currentPage:1, // 当前的页数
    pageSize: 3, // 每次加载请求的条数 默认10 
    params:{}
  },
  onLoad: function (options) {
    this.setData({
      keyword:options.keyword
    })
    let params = {
      pageSize: this.data.pageSize,
      page: this.data.currentPage
    }
    this.setData({
      params: params
    })
    this.requestQueryProductList(params)
  },
  onShow: function () {
    
  },
  onScroll(){
    // 向下滑动的时候请求数据
    if (this.data.currentPage > this.data.totalPage) return
    let page = this.data.currentPage
    page+=1
    let {params} = this.data
    params.page = page
    this.setData({
      currentPage: page,
      params: params
    })
    this.requestQueryProductList(this.data.params)
  },
  requestQueryProductList(params){
    let r = RequestFactory.queryProductListAPP(params);
    let productInfo = this.data.productInfo
    r.finishBlock = (req) => {
      let datas = req.responseObject.data
      this.setData({
        productInfo: productInfo.concat(datas.data),
        totalPage: datas.total
      })
    }
    r.addToQueue();
  },
  productCliked(e){
    Tool.navigateTo('/pages/product-detail/product-detail?productId='+ e.currentTarget.dataset.id)
  },
  navbarClicked(e){
    // 1 综合 2销量 3价格 不是数字为变化排版
    let n = e.detail.n
    let sort = e.detail.sort
    if (n === false || n === true){
      this.setData({
        show: n
      })
      return
    }
    let params = {
      pageSize: this.data.pageSize,
      page: 1
    }
    switch (n) {
      case 1:
        break;
      case 2:
        params.salseNum = 2
        break;
      case 3:
        let sortType = sort? 1:2
        params.sort = sortType
        break;
    }
    this.setData({
      params: params,
      currentPage:1,
      productInfo: []
    }) 
    this.requestQueryProductList(this.data.params)
  }
})