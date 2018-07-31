// pages/my/account.js
let {Tool, RequestFactory, Storage, Event} = global
Page({
    data: {
        hasInf: false,
        time: ''
    },
    //获取数据
    getData() {
        let params = {
            page: 1,
            pageSize:10
        };
        let r = global.RequestFactory.queryStoreMessageList(params);
        r.finishBlock = (req) => {
            if (req.responseObject.data.resultCount > 0) {
                let datas = [];
                datas = req.responseObject.data.data;
                this.setData({
                    hasInf: true,
                    time: Tool.formatTime(datas[0].pushTime)
                })
            }
        };
        r.addToQueue();
    },

    onLoad: function (options) {
        this.getData()
    },
    onShow: function () {

    },

    didLogin() {
        if (!Tool.didLogin(this)) {
            Tool.navigateTo('/pages/login/login-wx/login-wx');
            return false
        }
        return true
    },

    onUnload: function () {

    },
})