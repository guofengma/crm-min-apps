let { Tool, RequestFactory, Storage } = global

Page({
  data: {
    list:{},
    state:'',
    datas:[]
  },
  onLoad: function (options) {
    this.setData({
      list: Storage.getInnerOrderList() || ''
    })
    this.findReturnProductById(options.returnProductId)
  },
  findReturnProductById(returnProductId) {
    let list = this.data.list
    let params = {
      returnProductId: returnProductId || this.data.list.returnProductId
    };
    let r = RequestFactory.findReturnProductById(params)
    r.finishBlock = (req) => {
      let datas = req.responseObject.data
      if (datas.returnProduct.status ==4){
        datas.statusName = '退款成功'
      } else {
        datas.statusName = '退款中'
      }
      this.setData({
        datas: datas
      })
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
})