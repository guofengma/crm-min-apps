let { Tool, RequestFactory, Event, Storage } = global

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
    remark:'', // 买家留言
    door:1, //1是产品详情页进入 2是购物车进入 3是从我的订单进来的 
    coupon:{id:""}, //优惠券信息
  },
  onLoad: function (options) {
    this.setData({
      params: options.params,
      door: options.type
    })
    this.requestOrderInfo()
    Event.on('updateOrderAddress', this.updateOrderAddress,this)
    Event.on('updateCoupon', this.updateCoupon,this)
  },
  onShow: function () {
  
  },
  updateCoupon(){
    let coupon = Storage.getCoupon()
    let orderInfos = this.data.orderInfos
    if (this.data.addressType==1){ // 快递
      let val = orderInfos.totalPrice + orderInfos.totalFreightFee - coupon.value
      orderInfos.totalAmounts = val > 0 ? val:0
    } else {
      let val = orderInfos.totalPrice - coupon.value
      orderInfos.showSelfListingPrice = val > 0 ? val : 0
    }
    this.setData({
      orderInfos: orderInfos,
      coupon: coupon
    })
    if (this.data.coupon.id){ // 选择了优惠券的时候请求数据
      this.orderCalcDiscountCouponAndUseScore()
    }
  },
  orderCalcDiscountCouponAndUseScore() { 
    let params = {
      couponId: this.data.coupon.id,
      orderProductList: this.data.params
    }
    let r = RequestFactory.orderCalcDiscountCouponAndUseScore(params);
    r.finishBlock = (req) => {
      console.log(req.responseObject.data)
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  requestOrderInfo(){
    let params = { orderProductList:this.data.params}
    let r = RequestFactory.makeSureOrder(params);
    r.finishBlock = (req) => {
      let item = req.responseObject.data
      // 渲染地址列表
      let userAdress = item.default_addr

      if (userAdress){
        item.address = {
          hasData: userAdress.receiver ? true : false,
          receiver: userAdress.receiver,
          recevicePhone: userAdress.recevicePhone,
          addressInfo: userAdress.province + userAdress.city + userAdress.area + userAdress.address,
          address: userAdress.address,
          areaCode: userAdress.areaCode,
          cityCode: userAdress.cityCode,
          provinceCode: userAdress.provinceCode
        }
      }
     
      //渲染产品信息列表
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
      // 是否有自提的权限
      item.hasSelfLifting = (item.dealer.picked_up==1? true:false)
      if (item.hasSelfLifting){
        this.queryStoreHouseList()
      }
      // 积分抵扣计算
      let score = item.dealer.user_score > item.totalScore ? item.totalScore : item.dealer.user_score
      item.showScore = score 
      item.reducePrice = item.userScoreToBalance * score
      item.showProduct = showProduct
      // 当商品可以使用积分 用户积分大于0的时候 显示可以使用积分 
      item.canUseScore = (item.totalScore > 0 && item.dealer.user_score)? true:false

      let addressList = this.data.addressList
      addressList[1] = item.address
      this.setData({
        orderInfos: item,
        addressList: addressList
      })
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  addressClicked(){
    Tool.navigateTo('/pages/address/choose-address/choose-address?addressType=' + this.data.addressType)
  },
  changeAddressType(e){
    let index = e.currentTarget.dataset.index
    let orderInfos = this.data.orderInfos
    this.setData({
      addressType: e.currentTarget.dataset.index
    })
    if (this.data.coupon.id){ // 弱使用了优惠券更新
      this.updateCoupon()
    } else {
      orderInfos.showSelfListingPrice = orderInfos.totalPrice
    }
    this.setData({
      orderInfos: orderInfos
    })
  },
  switchChange(){
    let order = this.data.orderInfos

    if (!this.data.isUseIntegral){
      order.totalAmounts -= order.reducePrice
    } else {
      order.totalAmounts += order.reducePrice
    }
    this.setData({
      isUseIntegral: !this.data.isUseIntegral,
      orderInfos: order
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
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  updateOrderAddress(){
    let address = Storage.getOrderAddress()
    let addressList = this.data.addressList
    addressList[this.data.addressType] = address
    this.setData({
      addressList: addressList
    })
    let params ={
      cityCode: address.cityCode,
      orderProductList: this.data.params
    }
    let orderInfos = this.data.orderInfos
    if (this.data.addressType==2) return
    let r = RequestFactory.calcFreight(params);
    r.finishBlock = (req) => {
      let data = req.responseObject.data
      orderInfos.totalAmounts = data.totalAmounts
      orderInfos.totalFreightFee = data.totalFreightFee
      this.setData({
        orderInfos: orderInfos
      })
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  remarkChange(e){
    this.setData({
      remark: e.detail.value
    })
  },
  payBtnClicked(){
    let score = this.data.orderInfos.showScore
    if (!this.data.isUseIntegral){
        score=0
    }
    let orderAddress = this.data.addressList[this.data.addressType]
    let storehouseId = this.data.addressType == 2? orderAddress.id : ''
    let params = {
      address: orderAddress.address,
      areaCode: orderAddress.areaCode || '',
      buyerRemark: this.data.remark,
      cityCode: orderAddress.cityCode || '',
      orderProductList: this.data.params,
      pickedUp: this.data.addressType,
      provinceCode: orderAddress.provinceCode || '',
      receiver: orderAddress.receiver || '',
      recevicePhone: orderAddress.recevicePhone || '',
      storehouseId: storehouseId,
      useScore: score,
      couponId: this.data.coupon.id || ''
    }
    let r = RequestFactory.submitOrder(params);
    r.finishBlock = (req) => {        
      //Event.emit('updateStorageShoppingCart')
      Event.emit('updateShoppingCart')
      let data = req.responseObject.data
      Tool.redirectTo('/pages/order-confirm/pay/pay?data=' + JSON.stringify(data))
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  couponClicked(){
    let productIds = []
    let orderList = this.data.orderInfos.priceList
    orderList.forEach((item)=>{
      productIds.push(item.product_id)
    })
    Tool.navigateTo("/pages/my/coupon/my-coupon/my-coupon?door=1&&productIds=" + "'"+productIds.join(",")+"'")
  },
  onUnload: function () {
    Event.off('updateOrderAddress', this.updateOrderAddress)
  }
})