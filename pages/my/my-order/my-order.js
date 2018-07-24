let { Tool, RequestFactory, Storage, Event} = global;
Page({
    data: {
        num: 0,
        requestUrl: '',
        params: {},
        totalPage: '', // 页面总页数
        currentPage: 1, // 当前的页数
        pageSize: 10, // 每次加载请求的条数 默认10
        list: [],
        hasNext: true,//是否有下一页
        tipVal: '',//是否暂无数据
        isCancel: false,//是否取消订单
        isDelete: false, //是否删除订单
        orderId:'',
        status:'',
        content:'',//取消订单理由
        reason:'',
        orderNum:'',
        key: 0,
    },
    //获取列表数据
    getList(e) {
        let index = e.currentTarget.dataset.index;
        this.setData({
            num: index,
            hasNext: true,
            list: [],
            tipVal: '',
            key: 0
        });
        this.getData(index);
    },
    //获取数据
    getData(index) {
        if (this.data.hasNext) {
            let params = {
                pageSize: this.data.pageSize,
                page: this.data.currentPage,
                // dealerId: Storage.memberId()
            };
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
                if (item.orderStatus == 1) {
                  let now = Tool.timeStringForDate(new Date(), "YYYY-MM-DD HH:mm:ss");
                  let timeInterval = Tool.timeIntervalFromString(item.createTime);
                  let nowTimeInterval = Tool.timeIntervalFromString(now);
                  let duration = 30 * 60 - (nowTimeInterval - timeInterval);
                  secondMap.set(key, duration);
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
              if (this.data.totalPage > this.data.currentPage) {
                this.setData({
                  currentPage: ++this.data.currentPage
                })
              } else {
                this.setData({
                  currentPage:1,
                  hasNext:false
                })
              }
              if (!this.data.list.length) {
                this.setData({
                  tipVal: 2
                });
              }
              if (secondMap.size > 0) {
                this.countdown(this);
              }
            };
            Tool.showErrMsg(r)
            r.addToQueue();
        }

    },
    // 上拉加载更多
    onReachBottom() {
      this.getData(this.data.num);
    },
    //跳到订单详情
    toOrderDetail(e) {
        Tool.navigateTo('../orderDetail/orderDetail?orderId=' + e.currentTarget.dataset.id + '&status=' + e.currentTarget.dataset.status)
    },
    //删除订单
    deleteItem(e) {
        let id = e.currentTarget.dataset.id;
        let status = e.currentTarget.dataset.orderstatus;
        this.setData({
            isDelete: true,
            orderId:id,
            status:status
        });

    },
    dismissCancel() {
        //取消取消订单
        this.setData({
            isCancel: false,
            isDelete: false,
        })
    },
    deleteOrder(){
        let r;
        let params = {
            orderId: this.data.orderId,
        };
        if(this.data.status==7){//已完成订单
            r=RequestFactory.deleteOrder(params)
        }else{
            r=RequestFactory.deleteClosedOrder(params)
        }
        r.finishBlock = (req) => {
            if(req.responseObject.code==200){
                this.setData({
                    isDelete:false,
                    list:[],
                    hasNext:true
                });
                this.getData(this.data.num);
            }else{
                Tool.showSuccessToast(req.responseObject.msg)
            }

        };
        Tool.showErrMsg(r)
        r.addToQueue();
    },
    //取消订单
    reasonClicked(e) {
        //取消订单的理由
        let content=e.currentTarget.dataset.content;
        let index=e.currentTarget.dataset.index;
        this.setData({
            content:content,
            reason:index
        });
    },
    cancelOrder(){
        if(this.data.content==''){
            Tool.showAlert('请选择取消理由！');
            return
        }
        let params = {
            buyerRemark: this.data.content,
            orderNum: this.data.orderNum,
        };
        let r=RequestFactory.cancelOrder(params);
        r.finishBlock = (req) => {
            if(req.responseObject.code==200){
                this.setData({
                    isCancel:false,
                    list:[],
                    hasNext:true
                });
                this.getData(this.data.num);
            }else{
                Tool.showSuccessToast(req.responseObject.msg)
            }

        };
        Tool.showErrMsg(r)
        r.addToQueue();
    },
    cancelItem(e) {
        let orderNum = e.currentTarget.dataset.ordernum;
        this.setData({
            isCancel: true,
            orderNum:orderNum,
        });
    },
    //确认收货
    confirmReceipt(e) {
        let id = e.currentTarget.dataset.id;
        let params = {
            orderId: id,
        };
        let that=this;
        Tool.showComfirm('确认收货？', function () {
            let r = RequestFactory.confirmReceipt(params);
            r.finishBlock = (req) => {
                if(req.responseObject.code==200){
                    that.setData({
                        list:[],
                        hasNext:true
                    });
                    that.getData(that.data.num);
                }else{
                    Tool.showSuccessToast(req.responseObject.msg)
                }

            };
            Tool.showErrMsg(r)
            r.addToQueue();
        })
    },
    onLoad: function (options) {
        if (options.index) {
            this.setData({
                num: options.index
            });
        }
        this.getData(this.data.num);
    },
    continuePay(e){
      let item = e.currentTarget.dataset.item
      let params = {
        totalAmounts: item.totalPrice + item.freightPrice, //总价
        orderNum: item.orderNum, // 订单号
        outTradeNo: item.outTrandNo  // 流水号
      }
      Tool.navigateTo('/pages/order-confirm/pay/pay?isContinuePay=' + true + '&data=' + JSON.stringify(params))
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

      var time = setTimeout(function () {
        that.countdown(that);
      }, 1000)

      that.setData({
        list: orderArry,
        time: time
      });
    },
    //再次购买
    continueBuy(e) {
      let params = {
        orderId: e.currentTarget.dataset.id,
      };
      let r = RequestFactory.orderOneMore(params);
      r.finishBlock = (req) => {
        let datas = req.responseObject.data
        datas.forEach((item) => {
          item.sareSpecId = item.id
          item.productNumber = item.num
          item.isSelect = true
        })
        Storage.setShoppingCart(datas)
        Event.emit('continueBuy');
        Tool.switchTab('/pages/shopping-cart/shopping-cart')
      };
      Tool.showErrMsg(r)
      r.addToQueue();
    },
    onUnload: function () {
      clearTimeout(this.data.time);
    },
})