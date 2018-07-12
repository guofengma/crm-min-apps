let { Tool, RequestFactory, Storage } = global
Page({
  data: {
    result: [
      { state: "商家已通过", info: "7天退换，请退货给买家", time: '倒计时' },
      { state: "退货中", info: "等待商家确认" },
      { state: "退货退款成功", info: "", time: '完成的时间' },
    ]
  },
  onLoad: function (options) {
    this.setData({
      list: Storage.getInnerOrderList() || ''
    })
    this.findReturnProductById()
  },
  findReturnProductById() {
    let list = this.data.list
    let params = {
      returnProductId: this.data.list.returnProductId
    };
    let r = RequestFactory.findReturnProductById(params)
    r.finishBlock = (req) => {
      let datas = req.responseObject.data
      this.setData({
        datas: datas
      })
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
})