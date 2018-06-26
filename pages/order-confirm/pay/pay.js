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
        isCard:false
    },
    //代币支付
    chooseToken() {
        this.setData({
            isToken:!this.data.isToken
        })
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

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})