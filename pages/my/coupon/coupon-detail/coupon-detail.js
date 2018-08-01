let {Tool, RequestFactory } = global;
Page({
  data: {
    disabled:true,
    active:true,
    detail:{}
  },
  getDetail(id){
      let params={
        id:id
      }
    let r = RequestFactory.getDiscountCouponById(params);
      r.finishBlock = (req) => {
        if (!req.responseObject.data) return
        let detail=req.responseObject.data.data;
          detail.start_time = Tool.formatTime(detail.start_time);
          detail.out_time = Tool.formatTime(detail.out_time);
          if (detail.status == 1 || detail.status == 2){
            this.setData({
              active: false
            })
          }
          if(detail.status==3){
            this.setData({
              disabled:true
            })
          }
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