let { Tool, RequestFactory, Event, Storage} = global

Page({

  /**
   * 页面的初始数据
   */
  data: {
    active:true,
    addressType:1,
    addressList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.addressType){
      this.setData({
        addressType: options.addressType
      })
    }
    this.queryAddressList()
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
      if (this.data.addressType.length > 0){
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