let { Tool, RequestFactory, Event, Storage } = global

Page({
    data: {
        payList:'',
        isShow:false, // 显示支付结果
        result:1, //支付结果
        payWayActive:[false,true,false],
        useAmount:[false,false],
        useBalance:0,
        isContinuePay:false, //是否是继续支付
        outTrandNo:'',
        payType:'',//上次支付时选择的支付方式
    },
    onLoad: function (options) {
      // 提交订单时返回的数据
      let payList = JSON.parse(options.data)
      payList.showTotalAmounts = payList.totalAmounts
      this.setData({
        payList: payList,
        isContinuePay: options.isContinuePay || false
      })
      // 如果有值 去继续支付
      if (this.data.payList.outTradeNo){
        this.continueToPay()
      } else if (!this.data.payList.outTradeNo && options.isContinuePay ){
        this.againToPrePay()
      }
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
      if (!payWay.isSelect){
        Tool.showAlert('请选择支付方式')
        return
      } 
      let payType = payWay.index == 0 ? 16 : 2
      if (this.data.payList.outTradeNo){
        this.continuePay(payType)
      } else{
        this.payOrder(payType)
      }
      
    },
    payOrder(payType){
      let params ={
        amounts: this.data.payList.showTotalAmounts,
        balance: 0, // 先按照0 写死
        orderNum: this.data.payList.orderNum,
        openid: Storage.getWxOpenid(),
        tokenCoin: 0, // 先按照0 写死
        "type": payType,
      }
      let r = RequestFactory.repay(params);
      r.finishBlock = (req) => {
        //this.test(payType, req)
        // this.wxPay(payType, req.responseObject.data.outTradeNo)
        let datas = req.responseObject.data
        this.wxPay(payType, datas.outTradeNo, datas.prePayStr)
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
    },
    continuePay(payType) {
      let params = {
        outTradeNo: this.data.payList.outTradeNo,
        "type": payType,
        openid: Storage.getWxOpenid()
      }
      let r = RequestFactory.continuePay(params);
      r.finishBlock = (req) => {
        // this.test(payType, req)
        // this.wxPay(payType, req.responseObject.data.outTradeNo)
        let datas = req.responseObject.data
        this.wxPay(payType, datas.outTradeNo, datas.prePayStr)
      };
      Tool.showErrMsg(r)
      r.addToQueue();
    },
    continueToPay() {
      let params = {
        outTradeNo: this.data.payList.outTradeNo
      }
      let r = RequestFactory.continueToPay(params);
      r.finishBlock = (req) => {
        let datas = req.responseObject.data
        let payList = this.data.payList
        payList.showTotalAmounts = datas.amounts
        this.setData({
          payType: datas.type,
          payList:payList
        })
      };
      Tool.showErrMsg(r)
      r.addToQueue();
    },
    againToPrePay(){
      let params = {
        orderNum: this.data.payList.orderNum,
      }
      let r = RequestFactory.againToPrePay(params);
      r.finishBlock = (req) => {
        let datas = req.responseObject.data
        let payList = this.data.payList
        payList.showTotalAmounts = datas.needPay
        payList.scorePrice = datas.scorePrice
        this.setData( {
            payList: payList
        })
      };
      Tool.showErrMsg(r)
      r.addToQueue();
    },
    wxPay(payType, outTradeNo, payList){ //微信支付
      let that = this
      wx.requestPayment({
        'timeStamp': payList.timeStamp,
        'nonceStr': payList.nonceStr,
        'package': payList.package,
        'signType': 'MD5',
        'paySign': payList.paySign,
        'success': function (res) {
          that.orderQuery(outTradeNo)
          // that.showResult(true)
        },
        'fail': function (res) {
          that.showResult(false)
        }
      })
      // let params = {
      //   productsDescription: outTradeNo,
      //   openid: Storage.getWxOpenid(),
      //   orderNum: outTradeNo,
      //   totalFee: this.data.payList.showTotalAmounts
      // }
      // let r = RequestFactory.wxPay(params);
      // r.finishBlock = (req) => {
      //   let that = this
      //   let payList = req.responseObject.data
       
      // };
      // Tool.showErrMsg(r)
      // r.addToQueue();
    },
    orderQuery(outTradeNo){
      let params = {
        outTradeNo: outTradeNo,
      }
      let r = RequestFactory.orderQuery(params);
      r.finishBlock = (req) => {
        this.showResult(true)
      };
      Tool.showErrMsg(r)
      r.addToQueue();
    },
    test(payType,req){
      let okCb = () => {
        this.paySuccess(payType, req.responseObject.data.outTradeNo)
      }
      let errCb = () => {
        this.showResult(false)
      }
      Tool.showComfirm('模拟第三方支付，点击确认为支付', okCb, errCb)
    }
})