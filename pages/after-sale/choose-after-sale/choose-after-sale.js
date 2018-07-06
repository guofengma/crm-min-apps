let { Tool, RequestFactory} = global

Page({
  data: {
  
  },
  onLoad: function (options) {
  
  },
  goPage(e){
    let index = parseInt(e.currentTarget.dataset.index) 
    let page = ''
    switch (index) {
      case 1:
      case 2:
        page = '/pages/after-sale/refund/apply-refund/apply-refund?refundType='+ index
        break;
      case 3:
        page = '/pages/after-sale/exchange-goods/apply-exchange/apply-exchange'
        break;
    }
    Tool.redirectTo(page)
  }
})