let { Tool, RequestFactory, Storage, Event } = global

import WxParse from '../../../libs/wxParse/wxParse.js';

Page({
  data: {
    didLogin: false,
    imgUrls: [],
    activeIndex: 1, // 轮播图片的index 
    show: true,
    msgShow: false,
    selectType: {}, // 是否选择了商品类型
    floorstatus: false, // 是否显示置顶的按钮
    giftBagId: '', // 商品id
    productInfo: '', // 商品信息
    productTypeList: [],
    productBuyCount: 1, //商品购买数量
    priceList: [],
    nodes: [{
            name: "table",
            attrs: {
        class: "table"
            },
            children: [],
    }],
    isShowGiftTips:false, //是否显示礼包升级提示
    size: 0
  },
  onLoad: function (options) {
    this.setData({
      giftBagId: options.giftBagId || '',
    })
    this.didLogin()
    // this.getGiftBagSpec()
    this.getGiftBagDetail()
    Event.on('didLogin', this.didLogin, this);
  },
  onShow: function () {

  },
  didLogin() {
    Tool.didLogin(this)
    Tool.isIPhoneX(this)
  },
  msgTipsClicked(e) {
    let n = parseInt(e.currentTarget.dataset.index)
    switch (n) {
      case 1:
        Tool.navigateTo('/pages/my/information/information')
        break;
      case 2:
        Tool.switchTab('/pages/index/index')
        break;
      case 3:

        break;
    }
  },
  giftBagClicked() {
    // 立即购买
    if (!this.data.didLogin) { // 未登录
      Tool.navigateTo('/pages/login/login-wx/login-wx?isBack=' + true)
      return
    }
    if (!this.data.selectType.productType){ // 未选择
      this.selectComponent("#prd-info-type").isVisiableClicked()
      return
    }

    let params = {
      orderProducts: [{
        num:1,
        priceId: this.data.productInfo.id,
        productId: this.data.productInfo.id,
        priceList: this.data.selectType.priceList
      }],
      orderType: 98
    }

    Tool.navigateTo('/pages/order-confirm/order-confirm?params=' + JSON.stringify(params) + "&type=0")
  },
  getGiftBagDetail() { //获取礼包详情
    let params = {
      giftBagId: this.data.giftBagId,
    }

    let r = RequestFactory.getGiftBagDetail(params)

    r.finishBlock = (req) => {
      let datas = req.responseObject.data
      // 渲染库存
      let giftStock = []
      datas.specList.forEach((items) => {
        let total = 0
        items.value.forEach((item) => {
          total += item.stock
        })
        giftStock.push(total)
      })

      // 显示各礼包总库存里面的最小库存

      datas.product.showStock = Math.min(...giftStock)

      this.setData({
        imgUrls: datas.ImgUrl,
        productInfo: datas.product,
        // priceList: datas.priceList,
        productId: datas.product.id,
        productTypeList: datas.specList
      })
      // 渲染表格
      let tr = []
      let tbody = this.data.nodes
      for (let i = 0; i < datas.infoValue.length; i++) {
        tr.push(
          {
            name: "tr",
            attrs: { class: "tr" },
            children: [ {
              name: "td",
              attrs: { class: 'td frist-td' },
              children: [{
                type: "text",
                text: datas.infoValue[i].param
              }]
            },
            {
              name: "td",
              attrs: { class: 'td td2' },
              children: [{
                type: "text",
                text: datas.infoValue[i].paramValue
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
      let html = datas.product.content
      WxParse.wxParse('article', 'html', html, this, 5);
    }
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  typeSubClicked(e) {
    this.setData({
      selectType: e.detail
    })
  },
  sliderChange(e) {
    this.setData({
      activeIndex: e.detail.current + 1
    })
  },
  // 切换 tabar
  infoChoose(e) {
    let show = e.currentTarget.dataset.show == 1 ? true : false
    this.setData({
      show: show
    })
  },
  btnClicked(e) {
    let n = parseInt(e.currentTarget.dataset.key)
    this.selectComponent("#prd-info-type").isVisiableClicked(n)
    // if (!this.data.selectType.id || n == 1) {
    //   
    // } else {
    //   this.makeSureOrder()
    // }

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
    if (e.detail.scrollTop > 200) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },
  msgClicked() {
    this.setData({
      msgShow: !this.data.msgShow
    })
  },
  counterInputOnChange(e) {
    this.setData({
      productBuyCount: e.detail
    })
  },
  onShareAppMessage: function (res) {
    let imgUrl = this.data.imgUrls[0].original_img ? this.data.imgUrls[0].original_img : ''
    let name = this.data.productInfo.name.length > 10 ? this.data.productInfo.name.slice(0, 10) + "..." : this.data.productInfo.name
    return {
      title: name,
      path: '/pages/product-detail/product-detail?productId=' + this.data.productId,
      imageUrl: imgUrl
    }
  },
  productTypeListClicked(e) {
    this.setData({
      productTypeList: e.detail.productTypeList
    })
  },
  closeMask(){
    this.setData({
      isShowGiftTips: !this.data.isShowGiftTips
    })
  },
  hiddenTips() {
    this.setData({
      msgShow: false
    })
  },
  onUnload: function () {
    Event.off('didLogin', this.didLogin);
  },
})