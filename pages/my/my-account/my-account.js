let {Tool, RequestFactory} = global;
Page({
    data: {
        available_balance:'',
        token_coin:'',
        user_score:''
    },
    //页面跳转
    toPage(e) {
        let index = e.currentTarget.dataset.index;
        if (index == 0) {
            Tool.redirectTo('cash/cash?account='+this.data.available_balance)
        } else if (index == 1) {
            Tool.redirectTo('token/token?account='+this.data.token_coin)
        } else if (index == 2) {
            Tool.redirectTo('deposit/deposit?account='+this.data.token_coin)
        } else if (index == 3) {
            Tool.redirectTo('integral/integral?account='+this.data.user_score)
        }
    },

    //获取数据
    getData() {
        let params = {};
        let r = global.RequestFactory.findDealerAccountByIdAPP(params);
        r.finishBlock = (req) => {
            let data = req.responseObject.data;
            this.setData({
                available_balance: data.available_balance,
                token_coin: data.token_coin,
                user_score: data.user_score,
            })

        };
        r.addToQueue();

    },
    onLoad: function (options) {
        this.getData()
    },

    onShow: function () {

    },

})