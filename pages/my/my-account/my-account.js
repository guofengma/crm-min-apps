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
            Tool.navigateTo('cash/cash?account='+this.data.available_balance)
        } else if (index == 1) {
            Tool.navigateTo('token/token?account='+this.data.token_coin)
        } else if (index == 2) {
            Tool.navigateTo('deposit/deposit?account='+this.data.token_coin)
        } else if (index == 3) {
            Tool.navigateTo('integral/integral?account='+this.data.user_score)
        }
    },

    //获取数据
    getData() {
        let params = {};
        let r = global.RequestFactory.findDealerAccountByIdAPP(params);
        r.finishBlock = (req) => {
            let data = req.responseObject.data;
            this.setData({
                available_balance: data.available_balance || 0,
                token_coin: data.token_coin || 0,
                user_score: data.user_score || 0,
                blocked_balances: data.blocked_balances || 0,
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