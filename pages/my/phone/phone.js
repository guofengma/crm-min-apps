// pages/my/account.js
let { Tool, RequestFactory } = global;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isNext:false,
        time:60,
        isTime:false
    },
    //下一步
    next(){
        this.setData({
            isNext:true
        })
    },
    //确定
    sure(){

    },
    // 取消
    cancel(){
        this.setData({
            isNext:false
        })
    },
    getCode(){
        this.countTime()

    },
    countTime(){
        let that=this;
        let timer = setInterval(function() {
            that.setData({
                time:--that.data.time,
                isTime:true
            });
            if (that.data.time <= 0) {
                that.setData({
                    time:60,
                    isTime:false
                });
                clearInterval(timer);
            }
        }, 1000);
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