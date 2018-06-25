let { Tool, RequestFactory } = global

Page({

  /**
   * 页面的初始数据
   */
  data: {
    active:true,
    adressType:1,
    adressList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      adressType: options.type
    })
  },
  onShow: function () {
  
  },
  newAddress() {
    let page = ''
    let adressType = this.data.adressType
    if (adressType == 1){
      if ( this.data.adressList.length > 0){
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