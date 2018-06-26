let { Tool, RequestFactory } = global

Page({
  data: {
    innerCount:1, //件数
    canUseIntegral:{canUse:false,isUse:false}, //能否使用积分和是否使用积分
    addressType:1, //1 快递 2自提
    canSelfLifting:false, //是否可以自提
    address:'', //地址
  },
  onLoad: function (options) {
    
  },
  onShow: function () {
  
  },
  addressClicked(){
    Tool.navigateTo('/pages/address/choose-address/choose-address?addressType=' + this.data.addressType)
  },
  changeAddressType(e){
    console.log(e.currentTarget.dataset.index)
    let index = e.currentTarget.dataset.index
    this.setData({
      addressType: e.currentTarget.dataset.index
    })
  },
  switchChange(){
    this.setData({
      canUseIntegral: { canUse: true, isUse: !this.data.canUseIntegral.isUse}
    })
  }
})