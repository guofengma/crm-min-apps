// pages/after-sale/exchange-goods/exchange-goods.js
Page({
  data: {
    addressType:1,
    src:'/img/address-icon-gray.png',
    result:[
      { state: "商家已通过", info: "7天退换，请退货给买家", time: ''},
      { state: "换货中", info: "等待商家确认" },
      { state: "等待买家确认收货", info: "",time:'' },
      { state: "换货完成", info: "" },
      { state: "订单异常", info: "请联系客服" }
    ]
  },
  onLoad: function (options) {
  
  },
})