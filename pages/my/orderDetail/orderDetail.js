let {Tool, RequestFactory, Storage} = global;

Page({
    data: {
        addressType: 1,
        src: '/img/address-icon-gray.png',
        address: {
            receiver:'',
            recevicePhone:'',
            addressInfo:''
        },
        hasData:true,
        imgSrcUrl: 'https://dnlcrm.oss-cn-beijing.aliyuncs.com/xcx/',
        logIcon: 'order-state-3-dark.png',
        isCancel: false,//是否取消订单
        isDelete: false, //是否删除订单
        secondArry: [],
        state: {
            status:'',
            left:'',
            right:'',
            middle:'',
            orderIcon: "order-state-1.png",
            info:'',
            time:'',
        },
        time: Object,
        countdown: '',
        detail: {},//详情信息
        orderId: '',//订单ID
        status: '',//订单状态
        content:'',//取消订单理由
        reason:'',
        page:[ // 0：售后完成 1：退款 2 退款中 3 退换 4 退换中
          [
            ''
          ],
          '/pages/after-sale/refund/apply-refund/apply-refund?refundType=1', // 申请退款
          '/pages/after-sale/only-refund/only-refund-detail/only-refund-detail',//退款中的页面
          [
            '/pages/after-sale/refund/apply-refund/apply-refund?refundType=2', //申请退货退款
            '/pages/after-sale/exchange-goods/apply-exchange/apply-exchange' //申请换货
          ],
          [
            '/pages/after-sale/refund/refund-detail/refund-detail',// 退货退款详情
            '/pages/after-sale/exchange-goods/exchange-goods'  //换货详情
          ]
        ]
    },
    onLoad: function (options) {
        this.setData({
            orderId: options.orderId,
            status: options.status,
            state: this.orderState(options.status)//订单状态相关信息
        });
        if (options.status == 1) {
            this.time()
        }
        if(options.status==4){
            this.addressType=2
        }
        this.getDetail();//获取详情
    },
    //获取详情
    getDetail() {
        let params = {
            orderId: this.data.orderId
        };
        let r;
        r = global.RequestFactory.getOrderDetail(params);
        r.finishBlock = (req) => {
            let detail=req.responseObject.data;
            detail.createTime=detail.createTime?Tool.formatTime(detail.createTime):'';
            detail.sysPayTime=detail.sysPayTime?Tool.formatTime(detail.sysPayTime):'';
            detail.payTime=detail.payTime?Tool.formatTime(detail.payTime):'';
            let address={};
            if(detail.status==4){
              address.addressInfo = '自提点：' + detail.storehouseProvince + detail.storehouseCity + detail.storehouseArea + detail.storehouseAddress;
            }else{
                address.receiver=detail.receiver;
                address.recevicePhone=detail.recevicePhone;
                address.addressInfo= detail.province + detail.city + detail.area + detail.address;
            }
            if(detail.sendTime!=''&&detail.sendTime!=null){
                detail.sendTime=Tool.formatTime(detail.sendTime);
                this.data.state.time= detail.sendTime?detail.sendTime:'';
            }else{
                detail.sendTime=''
            }
            this.setData({
                detail: detail,
                address: address,
                state:this.data.state
            })
            this.middleBtn()
            if (detail.status == 1){
              this.time()
            }
        };
        Tool.showErrMsg(r)
        r.addToQueue();
    },
    onShow: function () {

    },
    //删除订单
    deleteItem() {
        let id = this.data.orderId;
        let status = this.data.detail.status;
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
                });
                Tool.navigateTo('../my-order/my-order')
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
        }
        let params = {
            buyerRemark: this.data.content,
            orderNum: this.data.detail.orderNum,
        };
        let r=RequestFactory.cancelOrder(params);
        r.finishBlock = (req) => {
            if(req.responseObject.code==200){
                Tool.navigateTo('../my-order/my-order')
            }else{
                Tool.showSuccessToast(req.responseObject.msg)
            }

        };
        Tool.showErrMsg(r)
        r.addToQueue();
    },
    cancelItem() {
        this.setData({
            isCancel: true,
        });
    },
    //确认收货
    confirmReceipt() {
        let id = this.data.orderId;
        let params = {
            orderId: id,
        };
        let that=this;
        Tool.showComfirm('确认收货？', function () {
            let r = RequestFactory.confirmReceipt(params);
            r.finishBlock = (req) => {
                if(req.responseObject.code==200){
                    Tool.navigateTo('../my-order/my-order')
                }else{
                    Tool.showSuccessToast(req.responseObject.msg)
                }

            };
            Tool.showErrMsg(r)
            r.addToQueue();
        })
    },
    //复制
    copy(e){
        let that=this;
        wx.setClipboardData({
            data: that.data.detail.orderNum,
            success: function(res) {
               Tool.showSuccessToast('复制成功')
            }
        });

    },
    time() {
        //待付款订单 倒计时处理
      if (this.data.detail.status == '1') {

        let orderTime = this.data.detail.createTime;
        //转化为时间戳
        let timeInterval = Tool.timeIntervalFromString(orderTime);
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
      }

    },
    countdown(that) {

        clearTimeout(that.data.time);

        let second = that.data.duration;
        let detail = that.data.detail
        if (detail.status == '1') {
            if (second > 0) {//秒数>0
                let countDownTime = Tool.timeStringForTimeCount(second);
                that.setData({
                    duration: second - 1,
                    countdown: countDownTime + '后自动取消订单'
                });
            } else {
              detail.status = '8'
              that.setData({
                detail:detail,
                state: this.orderState(8)//订单状态相关信息
              });
            }
        }

        var time = setTimeout(function () {
            that.countdown(that);
        }, 1000);

        that.setData({
            time: time
        });
    },
    orderState(n) {
        //按钮状态 left right middle 分别是底部左边 右边 和订单详情中的按钮文案
        var state = '';
        if (n == 1) {
            state = {status: '等待买家付款', left: '取消订单', right: '继续支付', orderIcon: "order-state-1.png",info:'',time:''}
        } else if (n == 2) {
          // ['退款', '退款中', '退款成功', '退款失败']

          state = { status: '买家已付款', left: '订单退款', right: '订单退款', orderIcon: "order-state-2.png.png",info:'等待卖家发货...',time:''}

        } else if (n == 3) {
          // ['退换', '退换中', '退换成功','退换失败']

          state = { status: '卖家已发货', left: '查看物流', right: '确认收货',orderIcon: "order-state-3.png",info:'仓库正在扫描出仓...',time:''}

        } else if (n == 4) {

          // ['退款', '退款成功','退款失败']

          state = { status: '等待买家自提', left: '', right: '确认收货', orderIcon: "order-state-3.png",info:'',time:''}

        } else if (n == 5) {

          // ['退换', '退换中', '退换成功','退换失败']

          state = { status: '交易已完成', left: '删除订单', right: '再次购买', orderIcon: "order-state-5.png",info:'已签收',time:''};
        } else if (n == 6) {
            
            // 退款 退货等  判断 middle的状态
            state = {status: '退货中', left: '', right: '确认收货', orderIcon: "order-state-5.png",info:'',time:''}
        } else if (n == 7) {
            
            // 售后完成 或者 退换货等都完成 判断 middle的状态
            state = {status: '订单已完成', left: '删除订单', right: '再次购买', orderIcon: "order-state-5.png",info:'已签收',time:''};
        } else if (n == 8) {
            
          state = { status: '交易关闭', left: '删除订单', right: '再次购买', orderIcon: "order-state-6.png",info:'',time:''}
        } else if (n == 9) {
            // 不显示 ？
            state = {status: '删除订单', left: '', right: '',info:'',time:''}
        }
        return state
    },
    continuePay() {
      let params = {
        totalAmounts: this.data.detail.orderTotalPrice, //支付的钱
        orderNum: this.data.detail.orderNum,// 订单号
        outTradeNo: this.data.detail.outTradeNo||'', // 是否继续支付
      }
      Tool.navigateTo('/pages/order-confirm/pay/pay?isContinuePay=' + true + '&data=' + JSON.stringify(params))
    },
    //再次购买
    continueBuy(){

    },
    middleBtn(){
      let detail = this.data.detail
      let outOrderState = detail.status
      let childrenList = detail.list
      let middle = ''
      let btnArr = []
      childrenList.forEach((item,index)=>{
        let innerState = item.status
        let returnType = item.returnType
        let finishTime = item.finishTime
        if (outOrderState == 2 || outOrderState ==4 ){
          middle = { id: 1,content: '退款' }
        }
        if (outOrderState == 3){
          middle = { id: 3, content: '退换' }
        }
        if (outOrderState == 5) {
          // 确认收货的状态的订单售后截止时间和当前时间比
          let now = new Date().getTime()
          if (finishTime - now>0){
            middle = { id: 3, content: '退换' }
          }      
        }
        if ((innerState == 4) && returnType===null ) {
          middle = { id:2, content: '退款中' }
        }
        if ((innerState == 5 || innerState == 6) && returnType === null){
          middle = { id:4, content: '退换中' }
        }
        if (innerState==8 && returnType) {
          middle = { id: 0, returnType: returnType,content: '售后完成'}
        }
        item.middleBtn = middle
      })
      this.setData({
        detail: detail
      })
    },
    subBtnClicked(e){
      let id = e.currentTarget.dataset.id

      let index = e.currentTarget.dataset.index

      let list = this.data.detail.list[index]
      list.orderNum = this.data.detail.orderNum
      list.createTime = this.data.detail.createTime
      list.showRefund = list.price * list.num
      list.address = this.data.address
      Storage.setInnerOrderList(this.data.detail.list[index])

      let returnType = e.currentTarget.dataset.returnType

      let page = this.data.page[id]

      Tool.navigateTo(page)
    },
    onUnload: function () {
      clearTimeout(this.data.time);
    },
})