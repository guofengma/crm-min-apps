// pages/after-sale/refund/apply-refund.js
Page({
  data: {
    hidden:false,
    reason: {
      title: '请选择退款原因',
      list: ['7天无理由退换货', '未收到货', '商品描述的尺寸与实物不符', '少件/漏件', '假冒品牌/产品', '包装破损/商品破损', '未按约定时间发货', '退运费','发票问题']
    },
    activeIndex:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
  }
})