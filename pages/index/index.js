//index.js
//获取应用实例
const app = getApp()

let {Tool, RequestFactory} = global;

Page({
    data: {
        imgUrls: [],
        url: 'https://dnlcrm.oss-cn-beijing.aliyuncs.com/xcx/',
        classify: [
            {name: '美容美妆', imgurl: 'index-icon-1.png'},
            {name: '包包', imgurl: 'index-icon-2.png'},
            {name: '鞋子', imgurl: 'index-icon-3.png'},
            {name: '服饰', imgurl: 'index-icon-4.png'},
        ],
        recommendImgUrl: [],
        topicImgUrl: []
    },
    onLoad: function () {
        this.topicList();
        this.queryAdList();
        this.querySpeList();
        this.queryFeaturedList()
    },
    queryAdList() {
        let param={
            pageType:1,
            type:1,
        };
        // let r = RequestFactory.queryAdList(1,1);
        let r = RequestFactory.queryAdList(param);
        r.finishBlock = (req) => {
            this.setData({
                imgUrls: req.responseObject.data
            })
        };
        Tool.showErrMsg(r)
        r.addToQueue();
    },
    querySpeList() {
        let param={
            type:2,
            pageType:1
        };
        // let r = RequestFactory.queryAdList(1,2);
        let r = RequestFactory.queryAdList(param);
        r.finishBlock = (req) => {
            this.setData({
                topicImgUrl: req.responseObject.data
            })
        };
        Tool.showErrMsg(r)
        r.addToQueue();
    },
    adListClicked(e) {
        let adType = e.currentTarget.dataset.type;
        let val = e.currentTarget.dataset.val;
        let page = '';
        if (adType == 1) {
            page = '/pages/product-detail/product-detail?prodCode=' + val
        } else if (adType == 2) {

        }
        Tool.navigateTo(page)
    },
    queryFeaturedList() {
        let params = {
            linkType: 1,
            pageType: 1,
        };
        let r = RequestFactory.queryFeaturedList(params);
        r.finishBlock = (req) => {
            let data = req.responseObject.data ? req.responseObject.data : []
            this.setData({
                recommendImgUrl: req.responseObject.data
            })
        };
        Tool.showErrMsg(r)
        r.addToQueue();
    },
    topicList() {
        let params = {
            page: 0,
            size: 1
        };
        let r = RequestFactory.topicList(params);
        r.finishBlock = (req) => {
            let data = req.responseObject.data ? req.responseObject.data : [];
            this.setData({
                topicImgUrl: req.responseObject.data
            })
        };
        Tool.showErrMsg(r)
        r.addToQueue();
    },
    searchClicked() {
        Tool.navigateTo('/pages/search/search?door=0')
    },
    msgClicked() {
      Tool.navigateTo('/pages/my/information/information')
    },
    topicClicked(e){
      let id = e.currentTarget.dataset.id
      Tool.navigateTo('/pages/topic/topic?id='+id)
    },
    onShareAppMessage: function (res) {

    }
})
