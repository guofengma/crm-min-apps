// pages/my/account.js
let {Tool, RequestFactory, Event} = global;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        expanded:[false,false]
    },
    press(){
        wx.previewImage({
            current: '/img/code.png', // 当前显示图片的http链接
            urls: ['/img/code.png'] // 需要预览的图片http链接列表
        })
    },
    onLoad: function (options) {

    },

})