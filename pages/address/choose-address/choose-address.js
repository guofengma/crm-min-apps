let { Tool, RequestFactory } = global

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
    this.setData({
      addressType: options.addressType
    })
  },
  onShow: function () {
  
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
      page = '/pages/address/select-selfLifting-address/select-selfLifting-address'
    }
    Tool.navigateTo(page)
  }
})