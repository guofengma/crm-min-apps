let { Tool, RequestFactory } = global

Page({
  data: {
    innerCount:1, //件数
    isUseIntegral:false, //能否使用积分和是否使用积分
    addressType:1, //1 快递 2自提
    canSelfLifting:false, //是否可以自提
    address:'', //地址
    params:'',
    orderInfos:"",
  },
  onLoad: function (options) {
    this.setData({
      params: options.params
    })
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
          showName: item.spec,
          showType: item.spec,
          showPrice: item.sale_price,
          showQnt: item.num
        })
      })
      item.showProduct = showProduct
      item.canUseScore = item.totalScore>0? true:false
      this.setData({
        orderInfos: item
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
  payBtnClicked(){
    Tool.redirectTo('/pages/order-confirm/pay/pay')
  }
})