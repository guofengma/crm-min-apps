let { Tool, RequestFactory, Storage} = global

Page({
  data: {
    list:{}
  },
  onLoad: function (options) {
    this.setData({
      list: Storage.getInnerOrderList() || ''
    })
  },
  goPage(e){
    let index = parseInt(e.currentTarget.dataset.index) 
    let page = ''
    Tool.redirectTo('/pages/after-sale/apply-sale-after/apply-sale-after?refundType='+index)
  }
})