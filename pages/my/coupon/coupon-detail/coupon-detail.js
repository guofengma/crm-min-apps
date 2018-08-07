let {Tool, RequestFactory } = global;
Page({
  data: {
    disabled:true,
    active:true,
    detail:{},
    btn:""
  },
  getDetail(id){
      let params={
        id:id
      }
    let r = RequestFactory.getDiscountCouponById(params);
      r.finishBlock = (req) => {
        if (!req.responseObject.data) return
        let detail=req.responseObject.data;
          detail.start_time = Tool.formatTime(detail.startTime).slice(0,10);
          detail.out_time = Tool.formatTime(detail.outTime).slice(0,10);
          // if (detail.status == 1 || detail.status == 2){
          //   this.setData({
          //     active: false
          //   })
          // }
          // if(detail.status==3){
          //   this.setData({
          //     disabled:true
          //   })
          // }
          this.setData({
              detail: detail
          })
      };
      Tool.showErrMsg(r);
      r.addToQueue();
  },
  btnClicked(){
    let detail = this.data.detail

  },
  onLoad: function (options) {
      this.getDetail(options.id)
      this.setData({
        btn: options.btn
      })
  },
})