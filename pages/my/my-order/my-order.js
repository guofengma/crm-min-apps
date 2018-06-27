Page({
    data: {
        num: 1
    },
    //获取列表数据
    getList(e) {
        let index=e.currentTarget.dataset.index;
        this.setData({
            num:index
        });
        this.getData();
    },
    //获取数据
    getData() {
        if (this.data.hasNext) {
            let params = {
                pageSize: this.data.pageSize,
                page: this.data.currentPage,
            };
            this.setData({
                params: params
            });
            let r = global.RequestFactory.queryDetailBalanceListAPP(params);
            let list = this.data.list;
            r.finishBlock = (req) => {
                let datas=[];
                for (let i in req.responseObject.data.data) {
                    let item = req.responseObject.data.data[i];
                    item.create_time = Tool.formatTime(item.create_time);
                    if (item.use_type == 1 || item.use_type == 3) {
                        item.add = false
                    } else {
                        item.add = true
                    }
                    datas.push(item)
                }
                this.setData({
                    list: list.concat(datas),
                    totalPage: req.responseObject.data.total,
                });
                if (this.data.totalPage > this.data.currentPage) {
                    this.setData({
                        currentPage: ++this.data.currentPage
                    })
                } else {
                    this.data.hasNext = false
                }
            };
            r.addToQueue();
        }

    },
    // 上拉加载更多
    onReachBottom() {
        this.getData();
    },
    onLoad: function (options) {
        this.setData({
            num:options.index
        });
        this.getData();
    },
    onShow: function () {

    },

})