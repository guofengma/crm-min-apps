// pages/my/account.js
let {Tool, RequestFactory, Event} = global;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        expanded: [false, false],
        lower: [],
        super: {},
        params:{},
        number: '',
        currentPage: 1, // 当前的页数
        pageSize: 5, // 每次加载请求的条数 默认5
        hasNext:true,
        searchVal:''
    },
    search(e){
        let params=e.detail.value;
        this.setData({
            searchVal:params,
            hasNext:true
        });
        this.getList()
    },
    getList() {
        if (this.data.hasNext) {
            let params = {
                pageSize: this.data.pageSize,
                page: 1,
                params:this.data.searchVal
            };
            this.setData({
                params: params
            });
            let r = RequestFactory.queryDealerAddressBook(params);
            r.finishBlock = (req) => {
                this.setData({
                    lower: req.responseObject.data.lower,
                    number: req.responseObject.data.number,
                    super: req.responseObject.data.super
                });
                let amount=Math.ceil(this.data.number/this.data.pageSize);//总页数
                if (amount > this.data.currentPage) {
                    this.setData({
                        pageSize:(++this.data.currentPage)*this.data.pageSize
                    })
                } else {
                    this.data.hasNext = false
                }
            };
            Tool.showErrMsg(r);
            r.addToQueue();
        }
    },
    // 上拉加载更多
    onReachBottom() {
        this.getList();
    },
    upOrDown(e) {
        let index = e.currentTarget.dataset.index;
        this.data.expanded[index] = !this.data.expanded[index];
        this.setData({
            expanded: this.data.expanded
        })
    },
    card(e) {
        Tool.navigateTo('card/card?userId='+e.currentTarget.dataset.id)
    },
    onLoad: function (options) {
        this.getList()
    },

})