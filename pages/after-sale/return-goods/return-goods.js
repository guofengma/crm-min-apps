// pages/after-sale/refund/refund-detail/refund-detail.js
Page({
  data: {
    refundType: 1, //1为仅退货退款 2为仅退款
    result: [
      { state: "商家已通过", info: "7天退换，请退货给买家", time: '倒计时' },
      { state: "退货中", info: "等待商家确认" },
      { state: "退货退款成功", info: "", time: '完成的时间' },
    ]
  },
  onLoad: function (options) {
    this.setData({
      refundType: options.refundType
    })
  },
})