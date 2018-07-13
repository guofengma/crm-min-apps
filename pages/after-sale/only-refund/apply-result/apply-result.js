let { Tool, RequestFactory, Storage } = global
Page({
  data: {
    state:''
  },
  onLoad: function (options) {
    this.setData({
      list: Storage.getInnerOrderList() || ''
    })
    this.findReturnProductById(options.returnProductId)
  },
  onShow: function () {

  },
  orderState(n){
    let state =''
    if(n==0){
      state = { state: '提交成功!', content: '已转交相关客服处理，请耐心等待', icon: '/img/after-sale-right.png', className: 'green'}
    } else if(n==1){
      state = { state: '商家审核中...', content: '已转交相关客服，请耐心等待', icon: '/img/after-sale-right.png',className:'green' }
    } else if (n == 2) {
      state = { state: '商家拒绝你的请求!', content: '商品已发货，无法进行退款', icon: '/img/after-sale-err.png', className: 'red' }
    }
    this.setData({
      state: state
    })
  },
  findReturnProductById(returnProductId) {
    let params = {
      returnProductId: returnProductId || this.data.list.returnProductId
    };
    let r = RequestFactory.findReturnProductById(params)
    r.finishBlock = (req) => {
      let datas = req.responseObject.data
      this.setData({
        datas: datas
      })
      if (datas.returnProduct.status==3){
        this.orderState(2)
      } else {
        this.orderState(0)
      }
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
})