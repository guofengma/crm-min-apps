Page({
    data: {
    },
    //页面跳转
    toPage(e){
        let index=e.currentTarget.dataset.index;
        if(index==0){
            wx.redirectTo({
                url:'cash/cash'
            })
        }else if(index==1){
            wx.redirectTo({
                url:'token/token'
            })
        }else if(index==2){
            wx.redirectTo({
                url:'deposit/deposit'
            })
        }else if(index==3){
            wx.redirectTo({
                url:'integral/integral'
            })
        }

    },
    onLoad: function (options) {

    },
    onShow: function () {

    },

})