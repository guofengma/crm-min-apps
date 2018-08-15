let { Tool, RequestFactory, Storage, Event} = global;

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
    },
    onLoad: function (options) {
        this.setData({
            orderId: options.orderId,
            status: options.status,
            state: this.orderState(options.status)//订单状态相关信息
        });
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
            if (detail.status == 1){ // 开始倒计时
              let that = this
              let time = setInterval(function () { that.time() }, 1000)
              this.setData({
                time: time
              })  
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
        if (this.data.status == 7 || this.data.status == 5 ){//已完成订单
            r=RequestFactory.deleteOrder(params)
        } else if (this.data.status == 8 || this.data.status == 10 ){
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
            return
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
              // wx.hideToast();
              // Tool.showSuccessToast('复制成功')
            }
        });

    },
    time() {
      //待付款订单 倒计时处理
      let detail = this.data.detail
      let endTime = Tool.formatTime(detail.overtimeClosedTime) 
      let countdown = Tool.getDistanceTime(endTime, this)
      if (countdown ==0){
        detail.status = 10
        clearTimeout(this.data.time);
        this.setData({
          detail: detail,
          state: this.orderState(10)//订单状态相关信息
        })
      }
    },
    orderState(n) {
        //按钮状态 left right middle 分别是底部左边 右边 和订单详情中的按钮文案
        let stateArr = [
          { status: '等待买家付款', 
            bottomBtn: ['取消订单','继续支付'],
            bottomId:[1,2],
            orderIcon: "order-state-1.png", 
            info: '',
            time: ''
          },
          { status: '买家已付款',
            bottomBtn: ['', '订单退款'],
            bottomId: ['',3],
            orderIcon: "order-state-2.png.png", 
            info: '等待卖家发货...', 
            time: '' 
          },
          { status: '卖家已发货',
            bottomBtn: ['查看物流', '确认收货'], 
            bottomId: [5, 4],
            orderIcon: "order-state-3.png",
            info: '仓库正在扫描出仓...',
            time: ''
          },
          { status: '等待买家自提',
            bottomBtn: ['', '确认收货'], 
            bottomId: ['', 4],
            orderIcon: "order-state-3.png",
            info: '',
            time: ''
          },
          { status: '交易已完成',
            bottomBtn: ['删除订单', '再次购买'], 
            bottomId: [6,5],
            orderIcon: "order-state-5.png",
            info: '',
            time: ''
          },
          { status: '退货中/退货完成',
            bottomBtn: ['', '再次购买'],
            bottomId: ['', 5], 
            orderIcon: "order-state-5.png", 
            info: '',
            time: '' 
          },
          {
            status: '交易已完成',
            bottomBtn: ['删除订单', '再次购买'],
            bottomId: [6, 5],
            orderIcon: "order-state-5.png",
            info: '',
            time: ''
          },
          { status: '交易关闭',
            bottomBtn: ['删除订单', '再次购买'], 
            bottomId: [6, 5], 
            orderIcon: "order-state-6.png",
            info: '',
            time: ''
          },
          { status: '删除订单',
            bottomBtn: ['', ''], 
          },// 不显示？？？？
          {
            status: '交易关闭',
            bottomBtn: ['删除订单', '再次购买'],
            bottomId: [6, 5],
            orderIcon: "order-state-6.png",
            info: '',
            time: ''
          },
        ]
        return stateArr[n-1]
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
      let params = {
        orderId: this.data.orderId,
      };
      let r = RequestFactory.orderOneMore(params);
      r.finishBlock = (req) => {
        let datas = req.responseObject.data
        datas.forEach((item)=>{
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
          middle = { id: 2, content: '退换' }
        }
        if (outOrderState == 5) {
          // 确认收货的状态的订单售后截止时间和当前时间比
          let now = new Date().getTime()
          if (finishTime - now>0){
            middle = { id: 2, content: '退换' }
          }      
        }
        if (innerState == 4) {
          middle = { id:3, inner: innerState,content: '退款中' } 
        }
        if (innerState == 5 || innerState == 6){

          // 5 退货中 6 换货中
          middle = { id:3, inner: innerState,content: '退换中' }
        }
        if (innerState==8 && returnType) {
          middle = { id: 0, inner: innerState, content: '售后完成', returnType: returnType}
        }
        item.middleBtn = middle
      })
      this.setData({
        detail: detail
      })
    },
    subBtnClicked(e){
      // returnProductStatus  1申请中 2已同意 3拒绝 4完成 5关闭 6超时

      // getReturnProductType 1退款 2退货 3退货 

      let btnTypeId = e.currentTarget.dataset.id 

      let index = e.currentTarget.dataset.index

      let list = this.data.detail.list[index]

      list.orderNum = this.data.detail.orderNum

      list.createTime = this.data.detail.createTime

      list.showRefund = list.price * list.num

      list.address = this.data.address

      Storage.setInnerOrderList(this.data.detail.list[index])

      // 跳转页面

      this.goPage(list, btnTypeId)
    },
    goPage(list,btnTypeId){
      let page = ''
      let returnType = list.returnProductType
      let returnProductStatus = list.returnProductStatus
      let params = "?id=" + list.returnProductId
      if (returnType == 1 && (returnProductStatus == 2 || returnProductStatus == 4 || returnProductStatus == 1)) {

        page = '/pages/after-sale/only-refund/only-refund-detail/only-refund-detail' + params 

      } else if (returnType == 1 && returnProductStatus == 3) {

        page = '/pages/after-sale/only-refund/apply-result/apply-result'

      } else if (returnType == 2) {

        page = '/pages/after-sale/return-goods/return-goods'

      } else if (returnType == 3) {

        page = '/pages/after-sale/exchange-goods/exchange-goods'

      } else if (btnTypeId == 1) {
        params = ''
        page = '/pages/after-sale/apply-sale-after/apply-sale-after?refundType=0'

      } else if (btnTypeId == 2) {
        
        page = '/pages/after-sale/choose-after-sale/choose-after-sale'
      }
      Tool.navigateTo(page + params)
    },
    productClicked(e){
      let id = e.currentTarget.dataset.productid
      Tool.navigateTo('/pages/product-detail/product-detail?productId=' + id)
    },
    orderRefund(){
      Tool.showAlert('目前只支持单件商品退款，请进行单件退款操作~')
    },
    seeLogistics(e){
       let id = this.data.orderId;
      Tool.navigateTo('/pages/logistics/logistics?orderId='+id)
    },
    onUnload: function () {
      clearTimeout(this.data.time);
    },
})