let {Tool, RequestFactory, Event, Storage} = global;
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [{
            id: 1,
            name: '下单多久后发货'
        }, {
             id: 2,
            name: '怎么改地址'
        }
        ]
    },
    //跳到详情页
    toDetail() {
        Tool.navigateTo('/pages/my/account/account')
    },

    onLoad: function (options) {
    },
    onUnload: function () {
    }
})