// pages/my/account.js
let { Tool, RequestFactory, Storage, Event } = global;
import WxParse from '../../../../libs/wxParse/wxParse.js';
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
            let lists = this.data.list;
            r.finishBlock = (req) => {
                let datas = [];
                for (let i in req.responseObject.data.data) {
                  let item = req.responseObject.data.data[i];
                  datas.push(item)
                }
                this.setData({
                    list: lists.concat(datas),
                });
                let list = lists.concat(datas)
                let that = this;
                let listArr = []
                for (let i = 0; i < list.length; i++) {
                  listArr.push({ 
                    "orderTime": Tool.formatTime(list[i].orderTime), 
                    "pushCountry": list[i].pushCountry, 
                    "title": list[i].title, 
                    "noticeId": list[i].noticeId,
                    "content": list[i].content, 
                    "status": list[i].status
                  })
                  WxParse.wxParse('content' + i, 'html', list[i].content, this);
                  if (i === list.length - 1) {
                    WxParse.wxParseTemArray("list", 'content', list.length, this)
                  }
                }
                let list2 = this.data.list 
                list2.map((item, index, arr) => {
                  arr[index][0].orderTime = listArr[index].orderTime
                  arr[index][0].pushCountry = listArr[index].pushCountry
                  arr[index][0].title = listArr[index].title
                  arr[index][0].noticeId = listArr[index].noticeId
                  arr[index][0].content = listArr[index].content
                  arr[index][0].status = listArr[index].status
                });
                this.setData({
                  list: list2,
                  totalPage: req.responseObject.data.total,
                })
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