let { Tool, RequestFactory, Event, Storage } = global

Page({

    /**
     * 页面的初始数据
     */
    data: {
        payList:'',
        isShow:false, // 显示支付结果
        result:1, //支付结果
        payWayActive:[false,false,false],
        useAmount:[false,false],
        useBalance:0
    },
    onLoad: function (options) {
      // 提交订单时返回的数据
      let payList = JSON.parse(options.data)
      payList.showTotalAmounts = payList.totalAmounts
      this.setData({
        payList: payList
      })
    },
    changePrice(e){
      // 使用代币支付 和余额支付 
      // let index = e.currentTarget.dataset.index
      // let useAmount = this.data.useAmount
      // useAmount[index] = !useAmount[index]
      // let payList = this.data.payList
      // let totalAmounts = payList.totalAmounts
      // let usePrice = ''
      // let useBalance = ''
      // useAmount.forEach((item,key)=>{
      //   if(item && key==0){
      //     usePrice = payList.dealer.token_coin * payList.tokenCoinToBalance
      //     totalAmounts = totalAmounts - usePrice > 0 ? (totalAmounts - usePrice) : 0
      //   } else if (item && key == 1) {
      //     usePrice = payList.dealer.available_balance
      //     let n = totalAmounts - usePrice
      //     useBalance = n > 0 ? usePrice : Math.abs(parseInt(n * 100) / 100)
      //     totalAmounts = n > 0 ? n : 0
      //   }
    
      // })
      // payList.showTotalAmounts = parseInt(totalAmounts * 100) / 100
      // this.setData({
      //   useAmount: useAmount,
      //   payList: payList,
      //   useBalance: useBalance
      // })
    },
    payWay(e){
      let index = e.currentTarget.dataset.index
      let payWay = [false,false,false]
      payWay[index] = true
      this.setData({
        payWayActive: payWay
      })
    },
    payBtnCliked(){
      let payWay = this.isSelectPayWay()
      console.log(payWay)
      if (!payWay.isSelect){
        Tool.showAlert('请选择支付方式')
        return
      } 
      this.payOrder(payWay.index)
    },
    payOrder(payType){
      let payway = payType==0? 16:2
      let params ={
        amounts: this.data.payList.showTotalAmounts,
        balance: 0, // 先按照0 写死
        orderNum: this.data.payList.orderNum,
        tokenCoin: 0, // 先按照0 写死
        "type": payway,
      }
      let r = RequestFactory.repay(params);
      r.finishBlock = (req) => {
        let okCb = () =>{
          this.paySuccess(payway, req.responseObject.data.outTradeNo)
        }
        let errCb = () => {
          this.showResult(false)
        }
        Tool.showComfirm('模拟第三方支付，点击确认为支付', okCb, errCb)
      };
      Tool.showErrMsg(r)
      r.addToQueue();
    },
    paySuccess(payway,outTradeNo){
      let params ={
        amounts: this.data.payList.showTotalAmounts,
        outTradeNo:outTradeNo,
        payTime: Tool.timeStringForDate(new Date(), "YYYY-MM-DD HH:mm:ss"),
        tradeNo:'',
        'type':payway
      }
      let r = RequestFactory.paySuccess(params);
      r.finishBlock = (req) => {
        this.showResult(true)
      };
      Tool.showErrMsg(r)
      r.addToQueue();
    },
    isSelectPayWay(){
      let payway = { isSelect: false, index: null }
      this.data.payWayActive.forEach((item,index)=>{
        if(item){
          payway =  {isSelect:true,index:index}
        } 
      })
      return payway
    },
    showResult(bool){
      this.setData({
        isShow:true,
        result:bool,
      })
    },
    goPage(){
      Tool.redirectTo('/pages/my/my-order/my-order')
    }
})