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
    pageSize: 10, // 每次加载请求的条数 默认10 
    params:{},
    code:''
  },
  onLoad: function (options) {
    
    let params = {
      pageSize: this.data.pageSize,
      page: this.data.currentPage,
      keyword: options.keyword || '',
      areaCode: options.code || -1,
    }
    this.setData({
      keyword: options.keyword || '',
      params: params,
      code: options.code
    })

    // this.getRequestUrl(params)
    this.requestQueryProductList(params)
  },
  onShow: function () {
    
  },
  getKeyword(e){
    this.setData({
      keyword: e.detail.keyWord
    })
  },
  searchKeyword(){
    this.navbarClicked({detail:{n:1}})
  },
  reloadNet(){
    this.requestQueryProductList(this.data.params)
  },
  onScroll(){
    // 向下滑动的时候请求数据
    if (this.data.currentPage >= this.data.totalPage) return
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
    let r = ''
    if (this.data.keyword){
      r = RequestFactory.searchProduct(params)
    } else {
      r = RequestFactory.queryProductListAPP(params);
    }
    let productInfo = this.data.productInfo
    r.finishBlock = (req) => {
      let datas = req.responseObject.data
      if (datas.resultCount > 0) {
        this.setData({
          productInfo: productInfo.concat(datas.data),
          totalPage: datas.total
        })
      } else if (datas.resultCount == 0) {
        this.setData({
          tipVal: 2
        })
      } else {
        this.setData({
          tipVal: 1
        })
      }
    }
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  productCliked(e){
    Tool.navigateTo('/pages/product-detail/product-detail?productId='+ e.currentTarget.dataset.id)
  },
  // getRequestUrl(params){
  //   if (this.data.keyword) {
  //     this.searchProduct(params)
  //   } else {
  //     this.requestQueryProductList(params)
  //   }
  // },
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
      page: 1,
      keyword: this.data.keyword || -1,
      areaCode: this.data.code || -1,
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
    this.requestQueryProductList(params)
  }
})