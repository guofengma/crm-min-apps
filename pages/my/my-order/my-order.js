Page({
    data: {
        num: 1
    },
    //获取列表数据
    getList(e) {
        let index=e.currentTarget.dataset.index;
        this.setData({
            num:index
        })
    },
    onLoad: function (options) {

    },
    onShow: function () {

    },

})