let { Tool, RequestFactory, Event, Storage} = global

Page({
  data: {
    ysf: { title: '地址选择' },
    active:true,
    addressType:1,
    addressList:[]
  },
  onLoad: function (options) {
    if (options.addressType){
      this.setData({
        addressType: options.addressType
      })
    }
    Tool.isIPhoneX(this)
    this.queryAddressList()
    Event.on('updateAdressList', this.queryAddressList, this)
  },
  onShow: function () {
  
  },
  queryAddressList() {
    let r = ''
    if (this.data.addressType ==1 ) {
      r = RequestFactory.queryUserAddressList();
    } else {
      r = RequestFactory.queryStoreHouseList();
    }
    r.finishBlock = (req) => {
      if (req.responseObject.data.length > 0) {
        this.setData({
          addressList: req.responseObject.data
        })
      }
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  addressClicked(e){
    let index = e.currentTarget.dataset.index
    Storage.setOrderAddress(this.data.addressList[index])
    Event.emit('updateOrderAddress')
    Tool.navigationPop()
  },
  newAddress() {
    let page = ''
    let addressType = this.data.addressType
    if (addressType == 1){
      if (this.data.addressList.length > 0){
        page = '/pages/address/select-express-address/select-express-address'
      } else {
        page = '/pages/address/new-address/new-address'
      }
    } else {
      // page = '/pages/address/select-selfLifting-address/select-selfLifting-address'
    }
    Tool.navigateTo(page)
  }
})