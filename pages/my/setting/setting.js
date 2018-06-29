// pages/my/setting.js
let { Tool, RequestFactory } = global;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isLoginOut:false
    },
    switchChange(){

    },
    //收货地址
    address(){
        Tool.navigateTo('/pages/address/select-express-address/select-express-address')
    },
    //关于我们
    aboutUs(){
        Tool.navigateTo('/pages/my/aboutUs/aboutUs')
    },
    //退出登录
    loginOut(){
        this.setData({
            isLoginOut:true
        })
    },
    //确定
    outSure(){

    },
    //取消
    cancel(){
        this.setData({
            isLoginOut:false
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