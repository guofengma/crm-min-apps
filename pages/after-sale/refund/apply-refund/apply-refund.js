// pages/after-sale/refund/apply-refund.js
Page({
  data: {
    hidden:false,
    reason: {
      title: '换货原因',
      list: ['七天无理由退换货', '规格不符合', '质量存在问题']
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