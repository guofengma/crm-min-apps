// pages/pay/pay.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isToken:false,
        isLeft:false,
        isZfb:false,
        isWx:false,
        isCard:false,
        data:''
    },
    //代币支付
    chooseToken() {
        this.setData({
            isToken:!this.data.isToken
        })
        let price = this.data.data.totalAmounts
        if (this.data.price) {
          
        }
    },
    //余额支付
    chooseLeft() {
        this.setData({
            isLeft:!this.data.isLeft
        })
    },
    //银行卡
    chooseCard() {
        this.setData({
            isZfb:false,
            isWx:false,
            isCard:!this.data.isCard,
        })
    },
    //微信
    chooseWx() {
        this.setData({
            isZfb:false,
            isWx:!this.data.isWx,
            isCard:false,
        })
    },
    //支付宝
    chooseZfb() {
        this.setData({
            isZfb:!this.data.isZfb,
            isWx:false,
            isCard:false,
        })
    },
    onLoad: function (options) {
      this.setData({
        data: JSON.parse(options.data)
      })
    }
})