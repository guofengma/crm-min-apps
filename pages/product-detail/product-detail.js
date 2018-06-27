let { Tool, RequestFactory, Storage, Event } = global

import WxParse from '../../libs/wxParse/wxParse.js';

Page({
  data: {
    imgUrls: [],
    activeIndex:1, // 轮播图片的index 
    show:true,
    msgShow:false,
    isCollection:false, // 是否收藏了该商品
    selectType:{}, // 是否选择了商品类型
    floorstatus:false, // 是否显示置顶的按钮
    productId:'', // 商品id
    productInfo:'', // 商品信息
    productTypeList:[],
    productBuyCount:1, //商品购买数量
    priceList:[],
    nodes:  [{
      name:  "table",
      attrs:  {
        class: "table"
      },
      children: [],
    }]  
  },
  onLoad: function (options) {
    this.setData({
      productId: options.productId
    })
    this.requestFindProductByIdApp({ productId:this.data.productId})
  },
  onShow: function () {
  
  },
  msgTipsClicked(e){
    let n = e.currentTarget.dataset.index
    switch (n) {
      case 1:
        Tool.navigateTo('')
        break;
      case 2:
        Tool.switchTab('/pages/index/index')
        break;
      case 3:

        break;  
    }
  },
  addToShoppingCart(){
    // 加入购物车
    let params = {
      productId: this.data.productInfo.id,
      productNumber: this.data.productBuyCount,
      sareSpecId: this.data.selectType.id
    }
    let r = RequestFactory.addToShoppingCart(params);
    r.finishBlock = (req) => {
      Event.emit('updateShoppingCart')
      Tool.showSuccessToast('添加成功')
    };
    r.addToQueue();
  },
  requestFindProductByIdApp(params){
    // 查询商品信息
    let r = RequestFactory.findProductByIdApp(params);
    let productInfo = this.data.productInfo
    r.finishBlock = (req) => {
      let datas = req.responseObject.data
      let typeList = datas.saleSpecValueList;
      typeList.forEach((item)=>{
        item.typeList = item.spec_values.split(',')
      })
      this.setData({
        imgUrls: datas.ImgUrl,
        productInfo:datas.product,
        productTypeList: datas.saleSpecValueList,
        priceList: datas.priceList
      })
      let tr = []
      let tbody = this.data.nodes
      for (let i = 0; i < datas.infoValue.length;i++){ 
        console.log(datas.infoValue.length)
        tr.push(
          {
            name: "tr",
            attrs: { class: "tr" },
            children: [ {
              name: "td",
              attrs: { class:'td frist-td'},
              children: [{
                type: "text",
                text: datas.infoValue[i].parm
              }]
            },
            {
              name: "td",
              attrs: { class: 'td td2'},
              children: [{
                type: "text",
                text: datas.infoValue[i].parm_value
              }]
            }
            ]
          }  

        )
      }
      tbody[0].children = tr
      this.setData({
        nodes: tbody
      })
      /**
      * WxParse.wxParse(bindName , type, data, target,imagePadding)
      * 1.bindName绑定的数据名(必填)
      * 2.type可以为html或者md(必填)
      * 3.data为传入的具体数据(必填)
      * 4.target为Page对象,一般为this(必填)
      * 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
      */
      let html = datas.product.content 
      WxParse.wxParse('article', 'html', html, this, 5);
    }
    r.addToQueue();
  },
  typeSubClicked(e){
    this.setData({
      selectType: e.detail
    })
    if (this.data.selectType.typeClicked ==1){
      this.addToShoppingCart()
    } else {

    }
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
    Tool.switchTab('/pages/shopping-cart/shopping-cart')
  },
  btnClicked(e){
    let n = parseInt(e.currentTarget.dataset.key)
    if (!this.data.selectType.id){
      this.selectComponent("#prd-info-type").isVisiableClicked(n)
    } else {
      switch (n) {
        case 1:
          this.addToShoppingCart()
          break;
        case 2:
          Tool.navigateTo('/pages/order-confirm/order-confirm')
          break;
      }
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
  },
  counterInputOnChange(e){
    this.setData({
      productBuyCount:e.detail
    })
  },
  onShareAppMessage: function (res) {

    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    let imgUrl = this.data.imgUrls[0].original_img ? this.data.imgUrls[0].original_img:''
    return {
      title: "飓热小程序",
      path: '/pages/product-detail/product-detail?productId' + this.data.productId,
      imgUrl: imgUrl
    }
  }
})