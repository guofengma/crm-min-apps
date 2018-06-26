Page({
    data: {
        add:false
    },
    //页面跳转
    toPage(e){
        let index=e.currentTarget.dataset.index;
        if(index==0){
            wx.redirectTo({
                url:''
            })
        }else if(index==1){
            wx.redirectTo({
                url:''
            })
        }else if(index==2){
            wx.redirectTo({
                url:''
            })
        }else if(index==3){
            wx.redirectTo({
                url:''
            })
        }

    },
    onLoad: function (options) {

    },
    onShow: function () {

    },

})