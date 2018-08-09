let { Tool, RequestFactory } = global

Page({
  data: {
    num:0,
    condition:''
  },
  onLoad: function (options) {
    this.setData({
      condition:options.condition
    })
    this.selectComponent("#orderList").getData(this.data.num);
  },
  onReachBottom: function () {
    this.selectComponent("#orderList").onReachBottom()
  }
})