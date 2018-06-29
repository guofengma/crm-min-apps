let { Tool, RequestFactory, Event, Storage } = global

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isToken:false,
        isLeft:false,
        payList: { "totalAmounts": 2048, "totalPrice": 1000.0, "dealer": { "token_coin": 111, "address": "11111", "picked_up": 1, "level": 2, "phone": "18758328354", "user_score": 1111, "level_id": 3, "blocked_coin": 222, "blocked_balances": 11, "id": 9, "available_balance": 222, "realname": "陈微微" }, "orderNum": "2018062832941932456934139", "tokenCoinToBalance": 2, "totalScore": 0,'showTotalAmounts':'10' }, // 提交订单时返回的数据
        isShow:false, // 显示支付结果
        result:1, //支付结果
        payWayActive:[false,false,false]
    },
    onLoad: function (options) {
      // 提交订单时返回的数据
      // let payList = JSON.parse(options.data)
      // payList.showTotalAmounts = payList.totalAmounts
      // this.setData({
      //   payList: payList
      // })
    },
    //代币支付
    chooseToken() {
      this.setData({
        isToken: !this.data.isToken,
      })
      let payList = this.data.payList
      let token = Number(payList.dealer.token_coin * payList.tokenCoinToBalance)
      this.changePrice(this.data.isToken, token)
    },
    //余额支付
    chooseLeft() {
        let payList = this.data.payList
        let balance = payList.dealer.available_balance
        this.setData({
          isLeft:!this.data.isLeft,
        })
        this.changePrice(this.data.isLeft, balance)
    },
    changePrice(isUse,useAmount){
      if (this.data.payList.showTotalAmounts > 0) {
        let payList = this.data.payList
        let price = Number(payList.showTotalAmounts) 
        let showTotalAmounts = Number(payList.showTotalAmounts)
        if (isUse) {
          showTotalAmounts = price - useAmount > 0 ? (price - useAmount) : 0
        } else {
          showTotalAmounts = price + useAmount
        }
        payList.showTotalAmounts = parseInt(showTotalAmounts * 100) / 100
        this.setData({
          payList: payList
        })
      }
    },
    payWay(e){
      let index = e.currentTarget.dataset.index
      let payWay = [false,false,false]
      payWay[index] = true
      this.setData({
        payWayActive: payWay
      })
    },
    goPage(){
      Tool.redirectTo('')
    }
})