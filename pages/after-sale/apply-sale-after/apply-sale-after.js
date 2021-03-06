let { Tool, RequestFactory, Storage} = global;
Page({
  data: {
    hidden:false,
    reason:[
      {
        navbar:'申请退款',
        title: '请选择退款原因', // 仅退款
        choose:'退款原因',
        info: "退款说明",
        placeholder:"请填写退款说明",
        list: [
          '多拍/错拍/不想要', 
          '快递/物流一直未收到', 
          '未按约定时间发货',
          '商品/破损/少件/污渍等', 
          '货物破损已拒签',
          '假冒品牌/产品',
          '未按约定时间发货',
          '退运费',
          '发票问题',
          '其他'
        ]
      },
      {
        navbar: '申请退货',
        title: '请选择退货原因', //退款退货
        choose: '退货原因',
        info:"退货说明",
        placeholder: "请填写退货说明",
        list: [
          '7天无理由退换货',
          '商品描述的尺寸与实物不符',
          '商品/破损/少件/污渍等',
          '假冒品牌/产品',
          '包装破损/商品破损',
          '退运费',
          '发票问题',
          '其他'
        ]
      },
      {
        navbar: '申请换货',
        title: '请选择换货原因', // 换货
        choose: '退换货原因',
        info: "换货说明",
        placeholder: "请填写退货说明",
        list: [
          '7天无理由退换货',
          '商品描述的尺寸与实物不符',
          '商品/破损/少件/污渍等',
          '质量存在问题',
          '假冒品牌/产品',
          '其他'
        ]
      }
    ],
    activeIndex:'',
    refundType: 0, // 0为仅退款 1为退货退款  2为换货
    originalImg:[],
    smallImg:[],
    remark:'',
    page:[
      '/pages/after-sale/only-refund/apply-result/apply-result',
      '/pages/after-sale/return-goods/return-goods',
      '/pages/after-sale/exchange-goods/exchange-goods'
    ],
    placeholder: { placeholder: '请填写说明', disabled:false}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let placeholder = this.data.reason[options.refundType].placeholder
    this.setData({
      refundType: options.refundType,
      list: Storage.getInnerOrderList() || '',
      placeholder: { placeholder: placeholder, disabled: false }
    })
    wx.setNavigationBarTitle({
      title: this.data.reason[options.refundType].navbar
    })
  },
  chooseReason(){
    this.setData({
      hidden: !this.data.hidden,
      placeholder: { placeholder: ' ', disabled: true}
    })

  },
  makeSureReason(e){
    let placeholder= this.data.reason[this.data.refundType].placeholder
    this.setData({
      activeIndex: e.detail.activeIndex,
      hidden: e.detail.hidden,
      placeholder: { placeholder: placeholder, disabled: false }
    })
  },
  orderRefund(){
    if (this.data.activeIndex===''){
      Tool.showAlert('请选择' + this.data.reason[this.data.refundType].choose)
      return
    }
    if (this.data.refundType == 2 && Tool.isEmptyStr(this.data.remark)){
      Tool.showAlert(this.data.reason[this.data.refundType].placeholder)
      return
    }
    let list = this.data.list
    let params = {
      imgUrls: this.data.originalImg.join(','),
      orderProductId:list.id,
      remark: this.data.remark,
      returnReason: this.data.reason[this.data.refundType].list[this.data.activeIndex],
      smallImgUrls:this.data.smallImg.join(','),
    };
    let r = ''
    if (this.data.refundType==0){
      r = RequestFactory.orderRefund(params)
    } else if (this.data.refundType == 1) {
      r = RequestFactory.applyReturnGoods(params)
    } else {
      r = RequestFactory.applyExchangeProduct(params)
    }
    r.finishBlock = (req) => {
      Tool.redirectTo(this.data.page[this.data.refundType] + '?returnProductId=' + req.responseObject.data.returnProductId)
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