let { Tool, RequestFactory, Event } = global;

Page({
    data: {
        account:'',
        add:false,
        isExplain:false,
        isLevel:false,
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
    //兑换代币
    change(){
        Tool.navigateTo('../../../download-app/download-app')
    },
    // 提现说明
    explain(){
        this.setData({
            isExplain:true,
        })
    },
    //备注受限
    limit(){
        this.setData({
            isLevel:true,
        })
    },
    // 关闭弹窗
    closeMask(){
        this.setData({
            isExplain:false,
            isLevel:false,
        })
    },
    onLoad: function (options) {
        this.setData({
            account:options.account
        })
    },
    onShow: function () {

    },

})