let { Tool, RequestFactory } = global
Component({
  properties: {
    isCancel: Boolean,
    orderNum:String,
    door:Number
  },
  data: {
    reason:''
  },
  methods: {
    queryDictionaryDetailsType() { //获取取消订单的理由
      let params = {
        dType:1,
      }
      let r = RequestFactory.queryDictionaryDetailsType(params)
      r.finishBlock = (req) => {
        this.setData({
          reasonArr: req.responseObject.data
        })
      }
      Tool.showErrMsg(r)
      r.addToQueue();
    },
    reasonClicked(e) { // 选择取消订单的理由
      //取消订单的理由
      let content = e.currentTarget.dataset.content;
      let index = e.currentTarget.dataset.index;
      this.setData({
        content: content,
        reason: index
      });
    },
    dismissCancel(){
      this.triggerEvent('dismissCancel', {...this.data});
    },
    cancelOrder() { // 取消订单
      if (this.data.content == '') {
        Tool.showAlert('请选择取消理由！');
        return
      }
      let params = {
        buyerRemark: this.data.content,
        orderNum: this.data.orderNum,
      };
      let r = RequestFactory.cancelOrder(params);
      r.finishBlock = (req) => {
        if (req.responseObject.code == 200) {
          if(this.data.door==1){
            this.triggerEvent('cancelOrder', { ...this.data });
          } else {
            Tool.navigateTo('/pages/my/my-order/my-order')
          }
        } else {
          Tool.showSuccessToast(req.responseObject.msg)
        }

      };
      Tool.showErrMsg(r)
      r.addToQueue();
    },
  },
  ready: function () {
    this.queryDictionaryDetailsType()
  }
})