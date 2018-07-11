let { Tool, RequestFactory, Storage} = global;
Page({
  data: {
    hidden:false,
    reason: {
      title: '请选择退款原因',
      list: ['7天无理由退换货', '未收到货', '商品描述的尺寸与实物不符', '少件/漏件', '假冒品牌/产品', '包装破损/商品破损', '未按约定时间发货', '退运费','发票问题']
    },
    activeIndex:'',
    refundType:1, //2为退货退款 1为仅退款 3为换货
    originalImg:[],
    smallImg:[],
    remark:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      refundType: options.refundType,
      list: Storage.getInnerOrderList() || ''
    })
  },
  chooseReason(){
    this.setData({
      hidden: !this.data.hidden
    })
  },
  makeSureReason(e){
    this.setData({
      activeIndex: e.detail.activeIndex,
      hidden: e.detail.hidden
    })
  },
  orderRefund(){
    let list = this.data.list
    let params = {
      imgUrls: this.data.originalImg.join(','),
      orderProductId:list.id,
      remark: this.data.remark,
      returnReason: this.data.reason.list[this.data.activeIndex],
      smallImgUrls:this.data.smallImg.join(','),
    };
    let r = ''
    if (this.data.refundType==1){
      r = RequestFactory.orderRefund(params)
    } else if (this.data.refundType == 1) {
      r = RequestFactory.applyReturnGoods(params)
    } else {
      r = RequestFactory.applyExchangeProduct(params)
    }
    r.finishBlock = (req) => {

    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  uploadImage(e){
    this.setData({
      originalImg: e.detail.originalImg,
      smallImg: e.detail.smallImg,
    })
  },
  inputChange(e){
    this.setData({
      remark: e.detail.value
    })
  }
})