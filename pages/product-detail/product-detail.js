let { Tool, RequestFactory, Storage } = global

Page({
  data: {
    imgUrls: [],
    activeIndex:1, // 轮播图片的index 
    show:true,
    msgShow:false,
    isCollection:false, // 是否收藏了该商品
    selectType:'', // 是否选择了商品类型
    floorstatus:false, // 是否显示置顶的按钮
    productId:'', // 商品id
    productInfo:'', // 商品信息
    productTypeList:[]
  },
  onLoad: function (options) {
    this.setData({
      productId: options.productId
    })
    this.requestFindProductByIdApp({ productId:this.data.productId})
  },
  onShow: function () {
  
  },
  requestFindProductByIdApp(params){
    let r = RequestFactory.findProductByIdApp(params);
    let productInfo = this.data.productInfo
    r.finishBlock = (req) => {
      let datas = req.responseObject.data
      console.log(datas)
      let price = datas.product.group_price
      if (price > datas.product.v1){
        price = datas.product.v1
      }
      if (price > datas.product.v2) {
        price = datas.product.v2
      }
      if (price > datas.product.v3) {
        price = datas.product.v3
      }
      if (price > datas.product.v4) {
        price = datas.product.v4
      }
      datas.product.min_price = price
      this.setData({
        imgUrls: datas.ImgUrl,
        productInfo:datas.product,
        productTypeList: datas.infoValue
      })
    }
    r.addToQueue();
  },
  typeSubClicked(e){
    this.setData({
      selectType: e.detail
    })
  },
  sliderChange(e){
    this.setData({
      activeIndex: e.detail.current+1
    })
  },
  // 切换 tabar
  infoChoose(e){
    let show = e.currentTarget.dataset.show ==1 ?  true:false
    this.setData({
      show: show
    })
  },
  // 收藏
  collectionClicked(){
    this.setData({
      isCollection: !this.data.isCollection
    })
  },
  cartClicked(){
    Tool.navigateTo('')
  },
  btnClicked(e){
    let n = parseInt(e.currentTarget.dataset.key)
    if (!this.data.selectType){
      this.selectComponent("#prd-info-type").typeClicked()
    }
    switch (n) {
      case 1:
        
        break;
      case 2:

        break;
    }
  },
  goTop: function (e) {
    this.setData({
      scrollTop: 0
    })
  },
  scroll: function (e, res) {
    
    this.setData({
      msgShow: false
    });
    if (e.detail.scrollTop >200) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },
  msgClicked(){
    this.setData({
      msgShow: !this.data.msgShow
    })
  }
})