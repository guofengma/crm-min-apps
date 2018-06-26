// pages/my/orderDetail/orderDetail.js
Page({
  data: {
    addressType:1,
    src:'/img/address-icon-gray.png',
    imgSrcUrl:'https://dnlcrm.oss-cn-beijing.aliyuncs.com/xcx/',
    logIcon: 'order-state-3-dark.png',
    isCancel: false,//是否取消订单
    isDelete: false, //是否删除订单
  },
  onLoad: function (options) {
  
  },
  onShow: function () {
  
  },
  dismissCancel(){
    //取消取消订单
    this.setData({
      isCancel:false
    })
  },
  reasonClicked(e){
    //取消订单的理由
  },
  cancelOrder(){
    //取消订单
  },
  orderState(){
    //按钮状态 left right middle 分别是底部左边 右边 和订单详情中的按钮文案
    let state = ''
    switch (n) {
      case 1:
        state = { status: '等待买家付款', left: '取消支付', right: '继续支付', middle: '', orderIcon:"order-state-1.png"}
        break;
      case 2:
        state = { status: '等待卖家发货', left: '订单退款', right: '订单退款', middle: '退款', orderIcon: "order-state-2.png" }
        break;
      case 3:
        state = { status: '等待买家收货', left: '查看物流', right: '确认收货', middle: '退换货', orderIcon: "order-state-3.png" }
        break;
      case 4:
        state = { status: '等待买家自提', left: '', right: '确认收货', middle: '退款', orderIcon: "order-state-3.png" }
        break;
      case 5:
        state = { status: '交易已完成', left: '', right: '删除订单', middle: '申请售后', orderIcon: "order-state-5.png" }
        break;
      case 6:
        // 退款 退货等  判断 middle的状态 
        state = { status: '退货中', left: '取消支付', right: '继续支付', middle: '', orderIcon: "order-state-5.png"}
        break;
      case 7:
        // 售后完成 或者 退换货等都完成 判断 middle的状态 
        state = { status: '订单已完成', left: '', right: '删除订单', middle: '', orderIcon: "order-state-1.png" }
        break;
      case 8:
        state = { status: '交易关闭', left: '', right: '删除订单', middle: '', orderIcon: "order-state-1.png" }
        break; 
      case 9:
        // 不显示 ？
        state = { status: '删除订单', left: '', right: '', middle: '' }
        break; 
    }
    return state
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})