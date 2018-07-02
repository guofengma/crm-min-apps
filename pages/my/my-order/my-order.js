let {Tool, RequestFactory, Storage} = global;
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
        orderNum:''
    },
    //获取列表数据
    getList(e) {
        let index = e.currentTarget.dataset.index;
        this.setData({
            num: index,
            hasNext: true,
            list: [],
            tipVal: ''
        });
        this.getData(index);
    },
    //获取数据
    getData(index) {
        if (this.data.hasNext) {
            let params = {
                pageSize: this.data.pageSize,
                page: this.data.currentPage,
                dealerId: Storage.memberId()
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
                for (let i in req.responseObject.data.data[0]) {
                    let item = req.responseObject.data.data[0][i];
                    item.orderCreateTime = Tool.formatTime(item.orderCreateTime);
                    datas.push(item);
                }
                this.setData({
                    list: list.concat(datas),
                    totalPage: req.responseObject.data.total,
                });
                if (this.data.totalPage > this.data.currentPage) {
                    this.setData({
                        currentPage: ++this.data.currentPage
                    })
                } else {
                    this.data.hasNext = false
                }
                if (!this.data.list.length) {
                    this.setData({
                        tipVal: 2
                    });
                }
            };
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
        let status = e.currentTarget.dataset.status;
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
        totalAmounts: item.price + item.freightPrice, //总价
        orderNum: item.orderNum, // 订单号
        outTradeNo: item.outTrandNo  // 流水号
      }
      Tool.navigateTo('/pages/order-confirm/pay/pay?isContinuePay=' + true + '&data=' + JSON.stringify(params))
    },
    continueBuy(e){
      
    }
})