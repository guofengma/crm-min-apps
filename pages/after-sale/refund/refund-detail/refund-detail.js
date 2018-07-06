// pages/after-sale/refund/refund-detail/refund-detail.js
Page({
  data: {
    refundType: 1, //1为仅退货退款 2为仅退款
  },
  onLoad: function (options) {
    this.setData({
      refundType: options.refundType
    })
  },
})