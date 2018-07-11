let { Tool, RequestFactory, Storage } = global

Page({
  data: {
    list:{},
    result: [
      { state: "退款成功",time: '' },
      { state: "商家退款中" }
    ]
  },
  onLoad: function (options) {
    this.setData({
      list: Storage.getInnerOrderList() || ''
    })
  },
  findReturnProductById() {
    let list = this.data.list
    let params = {
      returnProductId:this.data.list.id
    };
    let r = RequestFactory.findReturnProductById(params)
    r.finishBlock = (req) => {

    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
})