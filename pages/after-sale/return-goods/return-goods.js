let { Tool, RequestFactory, Storage } = global
Page({
  data: {
    addressType:1,
    result: [
      { state: "商家已通过", info: "7天退换，请退货给卖家",tips:"退款中",time: '倒计时' },
      { state: "退货中", info: "等待商家确认",tips: "退款中" },
      { state: "退货退款成功", info: "",tips: "已退款",time: '完成的时间' },
    ],
    time:'',
    datas:'',
    expressNo: { id: 0, content: "请填写寄回的物流信息" },
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
      
      if (datas.returnProduct.status == 1) {
        let self = this
        datas.endTime = Tool.formatTime(datas.returnProduct.out_time)
        let time = setInterval(function () { Tool.getDistanceTime(datas.endTime, self); }, 1000);
        self.setData({
          time: time
        });
      }

      if (datas.returnProduct.express_no) {
        this.setData({
          expressNo: { id: 2, content: datas.returnProduct.express_no },
        })
      }

    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  logClicked(e){
    let express = e.currentTarget.dataset.express
    let page = ''
    if (express.id == 0) {
      page = '/pages/logistics/write-logistics/write-logistics?id=' + this.data.datas.returnProduct.id
    } else {
      page = '/pages/logistics/logistics'
    }
    Storage.setAfterSaleList(this.data.datas)
    Tool.navigateTo(page)
  },
  onUnload: function () {
    clearInterval(this.data.time)
  },
})