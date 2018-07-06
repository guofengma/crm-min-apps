// pages/my/account.js
let {Tool, RequestFactory, Event} = global;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        expanded:[false,false]
    },
    upOrDown(e){
        let index=e.currentTarget.dataset.index;
        this.data.expanded[index]=!this.data.expanded[index];
        this.setData({
            expanded:this.data.expanded
        })
    },
    onLoad: function (options) {

    },

})