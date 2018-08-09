let { Tool, RequestFactory, Storage, Event} = global;
Page({
  data: {
    num: 0,
    disabled:true
  },
  //获取列表数据
  getList(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
        num: index,
    });
    this.selectComponent("#orderList").getList();
  },
  // 上拉加载更多
  onReachBottom() {
    this.selectComponent("#orderList").onReachBottom()
  },
  onLoad: function (options) {
    if (options.index) {
      this.setData({
        num: options.index
      });
    }
    this.selectComponent("#orderList").getData(this.data.num);
  },
  searchOrder(){
    Tool.navigateTo('/pages/search/search?door=1')
  },
  /**
  * 倒计时
  */
  countdown: function (that) {
    clearTimeout(this.data.time);
    let mapArry = that.data.secondArry;
    let orderArry = that.data.list;
    for (let i = 0; i < orderArry.length; i++) {
      let order = orderArry[i];
      if (order.orderStatus == 1) {
        let second = mapArry.get(i);
        if (second > 0) {//秒数>0
          let countDownTime = Tool.timeStringForTimeCount(second);
          order.countDownTime = countDownTime + '后自动取消订单';
          mapArry.set(i, second - 1);
        } else {
          order.countDownTime = '交易关闭';
        }
      }
    }

    let time = setTimeout(function () {
      that.countdown(that);
    }, 1000)

    that.setData({
      list: orderArry,
      time: time
    });
  },
  onUnload: function () {
    clearTimeout(this.data.time);
  },
})