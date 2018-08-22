let { Tool, RequestFactory, Storage, Event } = global;
Component({
  properties: {
    num:Number,
    condition:String
  },
  data: {
    num: 0,
    params: {},
    totalPage: '', // 页面总页数
    currentPage: 1, // 当前的页数
    pageSize: 10, // 每次加载请求的条数 默认10
    list: [],
    tipVal: '',//是否暂无数据
    isCancel: false,//是否取消订单
    isDelete: false, //是否删除订单
    orderId: '',
    status: '',
    orderNum: '',
    key: 0,
    time:""
  },
  methods: {
    //获取列表数据
    getList(e) {
      this.setData({
        num: this.properties.num,
        list: [],
        tipVal: '',
        key: 0,
        currentPage: 1
      });
      this.getData(this.properties.num);
    },
    //获取数据
    getData(index) {
      let params = {
        pageSize: this.data.pageSize,
        page: this.data.currentPage,
      };
      if (this.properties.condition){
        params.condition = this.properties.condition
      }
      this.setData({
        params: params
      });
      let r;
      if (index == 0) {//全部订单
        r = RequestFactory.queryAllOrderPageList(params);
      } else if (index == 1) {//待支付
        r = RequestFactory.queryUnPaidOrderPageList(params);
      } else if (index == 2) {//待发货
        r = RequestFactory.queryUnSendOutOrderPageList(params);
      } else if (index == 3) {//待收货
        r = RequestFactory.queryWaitReceivingOrderPageList(params);
      } else if (index == 4) {//已完成
        r = RequestFactory.queryCompletedOrderPageList(params);
      }
      let list = this.data.list;
      r.finishBlock = (req) => {
        let datas = [];
        let secondMap = new Map();
        let key = this.data.key;
        for (let i in req.responseObject.data.data) {
          let item = req.responseObject.data.data[i];
          item.createTime = Tool.formatTime(item.orderCreateTime);
          // 礼包不显示产品描述
          if (item.orderProduct[0].orderType == 98) item.orderProduct[0].spec=''
          // 这块是倒计时 
          if (item.orderStatus == 1) {
            let now = Tool.timeStringForDate(new Date(), "YYYY-MM-DD HH:mm:ss");
            secondMap.set(key, 1);
          }
          key++;
          datas.push(item);
        }
        this.setData({
          list: list.concat(datas),
          totalPage: req.responseObject.data.total,
          secondArry: secondMap,
          key: key
        });

        if (!req.responseObject.data.total) {
          this.setData({
            tipVal: 2
          });
        }
        // 这块是倒计时 暂时取消不做了
        if (secondMap.size > 0) {
          this.countdown(this);
        }
      };
      Tool.showErrMsg(r)
      r.addToQueue();
    },
    // 上拉加载更多
    onReachBottom() {
      let { currentPage, totalPage } = this.data
      currentPage++
      if (totalPage >= currentPage) {
        this.setData({
          currentPage: currentPage
        })
        this.getData(this.data.num);
      }

    },
    //跳到订单详情
    toOrderDetail(e) {
      Tool.navigateTo('/pages/my/orderDetail/orderDetail?orderId=' + e.currentTarget.dataset.id + '&status=' + e.currentTarget.dataset.status)
    },
    //跳到物流页面
    logistics(e) {
      Tool.navigateTo('/pages/logistics/logistics?orderId=' + e.currentTarget.dataset.id)
    },
    //删除订单
    deleteItem(e) {
      let id = e.currentTarget.dataset.id;
      let status = e.currentTarget.dataset.orderstatus;
      this.setData({
        isDelete: true,
        orderId: id,
        status: status
      });
    },
    dismissCancel() {
      //取消取消订单
      this.setData({
        isCancel: false,
        isDelete: false,
      })
    },
    deleteOrder() {
      let r;
      let params = {
        orderId: this.data.orderId,
      };
      if (this.data.status == 7 || this.data.status == 5 || this.data.status == 6) {//已完成订单/待确认
        r = RequestFactory.deleteOrder(params)
      } else {
        r = RequestFactory.deleteClosedOrder(params)
      }
      r.finishBlock = (req) => {
        if (req.responseObject.code == 200) {
          this.setData({
            isDelete: false,
            list: []
          });
          this.getData(this.data.num);
        } else {
          Tool.showSuccessToast(req.responseObject.msg)
        }

      };
      Tool.showErrMsg(r)
      r.addToQueue();
    },
    cancelOrder() {
      this.setData({
        isCancel: false,
        list: []
      });
      this.getData(this.data.num);
    },
    cancelItem(e) {
      let orderNum = e.currentTarget.dataset.ordernum;
      this.setData({
        isCancel: true,
        orderNum: orderNum,
      });
    },
    //确认收货
    confirmReceipt(e) {
      let id = e.currentTarget.dataset.id;
      let params = {
        orderId: id,
      };
      let that = this;
      Tool.showComfirm('确认收货？', function () {
        let r = RequestFactory.confirmReceipt(params);
        r.finishBlock = (req) => {
          if (req.responseObject.code == 200) {
            that.setData({
              list: []
            });
            that.getData(that.data.num);
          } else {
            Tool.showSuccessToast(req.responseObject.msg)
          }
        };
        Tool.showErrMsg(r);
        r.addToQueue();
      })
    },
    //立即支付
    continuePay(e) {
      let item = e.currentTarget.dataset.item;
      let params = {
        totalAmounts: item.totalPrice + item.freightPrice, //总价
        orderNum: item.orderNum, // 订单号
        outTradeNo: item.outTrandNo  // 流水号
      };
      Tool.navigateTo('/pages/order-confirm/pay/pay?isContinuePay=' + true + '&data=' + JSON.stringify(params))
    },
    //再次购买
    continueBuy(e) {
      let params = {
        orderId: e.currentTarget.dataset.id,
      };
      let r = RequestFactory.orderOneMore(params);
      r.finishBlock = (req) => {
        let datas = req.responseObject.data;
        datas.forEach((item) => {
          item.sareSpecId = item.id;
          item.productNumber = item.num;
          item.isSelect = true
        });
        Storage.setShoppingCart(datas);
        Event.emit('continueBuy');
        Tool.switchTab('/pages/shopping-cart/shopping-cart')
      };
      Tool.showErrMsg(r);
      r.addToQueue();
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
          if (second) {//秒数>0
            // let countDownTime = Tool.timeStringForTimeCount(second);
            let endTime = Tool.formatTime(order.overtimeClosedTime)
            let countdown = Tool.getDistanceTime(endTime, this,1)
            order.countDownTime = countdown + '后自动取消订单';
            mapArry.set(i, countdown);
          } else {
            //order.countDownTime = '交易关闭';
            clearTimeout(this.data.time);
            order.orderStatus = 10
            this.setData({
              list: orderArry
            })
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
    time() {
      //待付款订单 倒计时处理
      let detail = this.data.detail
      let endTime = Tool.formatTime(detail.overtimeClosedTime)
      let countdown = Tool.getDistanceTime(endTime, this)
      if (countdown == null) {
        detail.status = 10
        clearTimeout(this.data.time);
        this.setData({
          detail: detail,
          state: this.orderState(10)//订单状态相关信息
        })
      }
    },
    onUnload(){
      clearTimeout(this.data.time);
    },
  },
  ready: function () {
    //this.getData(this.properties.num);
  }
})
