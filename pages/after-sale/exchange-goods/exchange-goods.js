let { Tool, RequestFactory, Storage } = global
Page({
  data: {
    addressType:1,
    src:'/img/address-icon-gray.png',
    result:[
      { state: "商家已通过", info: "7天退换，请退货给买家", time: ''},
      { state: "换货中", info: "等待商家确认" },
      { state: "等待买家确认收货", info: "",time:'' },
      { state: "换货完成", info: "" },
      { state: "订单异常", info: "请联系客服" }
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