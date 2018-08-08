// pages/my/account.js
let { Tool, RequestFactory, Storage, Event } = global;
Page({
    data: {
        params: {},
        totalPage: '', // 页面总页数
        currentPage: 1, // 当前的页数
        pageSize: 10, // 每次加载请求的条数 默认10
        list: [],
        hasNext: true//是否有下一页
    },
    onLoad: function (options) {
          this.getData()
    },
    onShow: function () {


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
            let r = global.RequestFactory.queryNoticeMessage(params);
            let list = this.data.list;
            r.finishBlock = (req) => {
                let datas = [];
                for (let i in req.responseObject.data.data) {
                    let item = req.responseObject.data.data[i];
                    item.pushTime = Tool.formatTime(item.orderTime);
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
    //跳到详情页
    informationDetail(){
        if (!this.didLogin()) return;
        Tool.navigateTo('../informationDetail/informationDetail')
    },
    didLogin(){
      if (!Tool.didLogin(this)){
        Tool.navigateTo('/pages/login/login-wx/login-wx');
        return false
      }
      return true
    },

    onUnload: function () {

    },
})