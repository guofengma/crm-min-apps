let {Tool, RequestFactory } = global;
Page({
  data: {
    disabled:true,
    active:true,
    detail:{}
  },
  getDetail(id){
      let r = RequestFactory.getDiscountCouponById(id);
      r.finishBlock = (req) => {
        let detail=req.responseObject.data.data;
          detail.start_time = Tool.formatTime(detail.start_time);
          detail.out_time = Tool.formatTime(detail.out_time);
          this.setData({
              detail: detail
          })
      };
      Tool.showErrMsg(r);
      r.addToQueue();
  },
  onLoad: function (options) {
      this.getDetail(options.id)
  },
})