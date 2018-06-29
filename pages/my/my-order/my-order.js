let {Tool, RequestFactory,Storage} = global;
Page({
    data: {
        num: 0,
        requestUrl:'',
        params: {},
        totalPage: '', // 页面总页数
        currentPage: 1, // 当前的页数
        pageSize: 10, // 每次加载请求的条数 默认10
        list: [],
        hasNext: true,//是否有下一页
        tipVal:''//是否暂无数据
    },
    //获取列表数据
    getList(e) {
        let index=e.currentTarget.dataset.index;
        this.setData({
            num:index,
            hasNext:true,
            list:[],
            tipVal:''
        });
        this.getData(index);
    },
    //获取数据
    getData(index) {
        if (this.data.hasNext) {
            let params = {
                pageSize: this.data.pageSize,
                page: this.data.currentPage,
                dealerId:Storage.memberId()
            };
            this.setData({
                params: params
            });
            let r;
            if(index==0){//全部订单
                r = global.RequestFactory.queryAllOrderPageList(params);
            }else if(index==1){//待支付
                r = global.RequestFactory.queryUnPaidOrderPageList(params);
            }else if(index==2){//待发货
                r = global.RequestFactory.queryUnSendOutOrderPageList(params);
            }else if(index==3){//待收货
                r = global.RequestFactory.queryWaitReceivingOrderPageList(params);
            }else if(index==4){//已完成
                r = global.RequestFactory.queryCompletedOrderPageList(params);
            }
            let list = this.data.list;
            r.finishBlock = (req) => {
                let datas=[];
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
                if(!this.data.list.length){
                    this.setData({
                        tipVal:2
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
    toOrderDetail(e){
        Tool.navigateTo('../orderDetail/orderDetail?orderId='+e.currentTarget.dataset.id+'&status='+e.currentTarget.dataset.status)
    },
    onLoad: function (options) {
        if(options.index){
            this.setData({
                num:options.index
            });
        }
        this.getData(this.data.num);
    },
    onShow: function () {

    },

})