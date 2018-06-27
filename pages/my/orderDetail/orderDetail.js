let { Tool, RequestFactory, Storage } = global

Page({
  data: {
    addressType:1,
    src:'/img/address-icon-gray.png',
    imgSrcUrl:'https://dnlcrm.oss-cn-beijing.aliyuncs.com/xcx/',
    logIcon: 'order-state-3-dark.png',
    isCancel: false,//是否取消订单
    isDelete: false, //是否删除订单
    secondArry:[],
    state:1,
    orderTime:'2018-6-27 10:10:00',
    time: Object,
    countdown:''
  },
  onLoad: function (options) {
    this.time()
  },
  onShow: function () {
  
  },
  dismissCancel(){
    //取消取消订单
    this.setData({
      isCancel:false,
      isDelete:false,
    })
  },
  reasonClicked(e){
    //取消订单的理由
    console.log(e)
  },
  cancelOrder(){
    //取消订单
    console.log('取消订单')
  },
  deleteOrder(){
    //删除订单
    console.log('删除订单')
  },
  time(){
    //待付款订单 倒计时处理
    // if (this.data.state == '1') {
        
        let orderTime = this.data.orderTime;
        //转化为时间戳
        let timeInterval = Tool.timeIntervalFromString(orderTime);
        console.log(timeInterval)
        // 把当前的时间格式化 
        let now = Tool.timeStringForDate(new Date(), "YYYY-MM-DD HH:mm:ss");
        let nowTimeInterval = Tool.timeIntervalFromString(now);
        // 当前时间和订单时间的差数
        let duration = 30 * 60 - (nowTimeInterval - timeInterval);
        //开始倒计时 
        this.setData({
          duration: duration
        });
        this.countdown(this);
    // }
        
  },
  countdown(that){
    
    clearTimeout(that.data.time);

    let second = that.data.duration;
     
    if (that.data.state == '1') {
      if (second > 0) {//秒数>0
        let countDownTime = Tool.timeStringForTimeCount(second);
        that.setData({
          duration: second -1,
          countdown: countDownTime + '后自动取消订单'
        });
      } else {
        that.setData({
          countdown: '交易关闭'
        });
      }
    }

    var time = setTimeout(function () {
      that.countdown(that);
    }, 1000)

    that.setData({
      time: time
    });
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