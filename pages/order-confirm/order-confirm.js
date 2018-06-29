let { Tool, RequestFactory, Event } = global

Page({
  data: {
    innerCount:1, //件数
    isUseIntegral:false, //能否使用积分和是否使用积分
    addressType:1, //1 快递 2自提
    canSelfLifting:false, //是否可以自提
    address:'', //地址
    params:'',
    orderInfos:"",
    addressList:[],
    door:1, //1是产品详情页进入 2是购物车进入
  },
  onLoad: function (options) {
    this.setData({
      params: options.params,
      door: options.type
    })
    if(options.type == 2) {
      // 如果是购物车的结算 刷新购物车
      Event.emit('updateStorageShoppingCart')
    }
    this.requestOrderInfo()
  },
  onShow: function () {
  
  },
  requestOrderInfo(){
    let params = { orderProductList:this.data.params}
    let r = RequestFactory.makeSureOrder(params);
    r.finishBlock = (req) => {
      let item = req.responseObject.data
      item.address= {
        hasData: item.default_addr.receiver? true:false,
        receiver:item.default_addr.receiver,
        recevicePhone:item.default_addr.recevicePhone,
        addressInfo:item.default_addr.province + item.default_addr.city + item.default_addr.area + item.default_addr.address
      }
      let showProduct =[]
      item.priceList.forEach((item)=>{
        showProduct.push({
          showImg: item.spec_img,
          showName: item.name,
          showType: item.spec,
          showPrice: item.sale_price,
          showQnt: item.num
        })
      })
      item.hasSelfLifting = (item.dealer.picked_up==1? true:false)
      if (item.hasSelfLifting){
        this.queryStoreHouseList()
      }
      let score = item.dealer.user_score > item.totalScore ? item.totalScore : item.dealer.user_score
      item.showScore = score 
      item.reducePrice = item.userScoreToBalance * score
      item.showProduct = showProduct
      item.canUseScore = item.totalScore>0? true:false
      let addressList = this.data.addressList
      addressList[1] = item.address
      this.setData({
        orderInfos: item,
        addressList: addressList
      })
    };
    r.addToQueue();
  },
  addressClicked(){
    Tool.navigateTo('/pages/address/choose-address/choose-address?addressType=' + this.data.addressType)
  },
  changeAddressType(e){
    let index = e.currentTarget.dataset.index
    this.setData({
      addressType: e.currentTarget.dataset.index
    })
  },
  switchChange(){
    this.setData({
      isUseIntegral: !this.data.isUseIntegral
    })
  },
  queryStoreHouseList() {
    let r = RequestFactory.queryStoreHouseList();
    r.finishBlock = (req) => {
      if (req.responseObject.data.length > 0) {
        let addressList = this.data.addressList
        addressList[2] = req.responseObject.data[0]
        this.setData({
          addressList: addressList
        })
      }
    };
    r.addToQueue();
  },
  payBtnClicked(){
    let score = this.data.orderInfos.showScore
    if (!this.data.isUseIntegral){
        score=0
    }
    let params = {
      address: this.data.orderInfos.default_addr.address,
      areaCode: this.data.orderInfos.default_addr.areaCode,
      buyerRemark:'',
      cityCode: this.data.orderInfos.default_addr.cityCode,
      orderProductList: this.data.params,
      pickedUp: this.data.addressType,
      provinceCode: this.data.orderInfos.default_addr.provinceCode,
      receiver: this.data.orderInfos.default_addr.receiver,
      recevicePhone: this.data.orderInfos.default_addr.recevicePhone,
      storehouseId: this.data.orderInfos.provinceCode||'',
      useScore: score
    }
    console.log(params)
    let r = RequestFactory.submitOrder(params);
    r.finishBlock = (req) => {
      let data = req.responseObject.data
      Tool.redirectTo('/pages/order-confirm/pay/pay?data=' + JSON.stringify(data))
    };
    r.addToQueue();
  }
})