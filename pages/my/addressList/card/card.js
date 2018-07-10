// pages/my/account.js
let {Tool, RequestFactory, Event} = global;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userId:'',
        detail:{}
    },
    //获取详情
    getDetail() {
        let params = {
            userId: this.data.userId
        };
        let r;
        r = global.RequestFactory.findDealerAddressBookDetails(params);
        r.finishBlock = (req) => {
            this.setData({
                detail:req.responseObject.data
            })
        };
        Tool.showErrMsg(r);
        r.addToQueue();
    },
    onLoad: function (options) {
        this.setData({
            userId: options.userId,
        });
        this.getDetail()
    },

})