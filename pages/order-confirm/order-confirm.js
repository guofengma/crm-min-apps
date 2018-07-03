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
  },
  onLoad: function (options) {
    this.setData({
      params: options.params,
      door: options.type
    })
    this.requestOrderInfo()
    Event.on('updateOrderAddress', this.updateOrderAddress,this)
  },
  onShow: function () {
  
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
      useScore: score
    }
    let r = RequestFactory.submitOrder(params);
    r.finishBlock = (req) => {        
      Event.emit('updateStorageShoppingCart')
      let data = req.responseObject.data
      Tool.redirectTo('/pages/order-confirm/pay/pay?data=' + JSON.stringify(data))
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  onUnload: function () {
    Event.off('updateOrderAddress', this.updateOrderAddress)
  }
})