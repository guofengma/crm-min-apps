// pages/my/account.js
let { Tool, RequestFactory, Event, Storage} = global;
const app=getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isLoginOut:false
    },
    //账号与安全
    account(){
        Tool.navigateTo('/pages/my/account/account')
    },
    //收货地址
    address(){
        Tool.navigateTo('/pages/address/select-express-address/select-express-address')
    },
    //关于我们
    aboutUs(){
        Tool.navigateTo('/pages/my/aboutUs/aboutUs')
    },
    //退出登录
    loginOut(){
        this.setData({
            isLoginOut:true
        })
    },
    //确定
    outSure(){
        let params={};
        let r = global.RequestFactory.exitLogin(params);
        r.finishBlock = (req) => {
            let data=req.responseObject;
            if(data.code==200){
                Tool.showSuccessToast(data.data);
                app.globalData.flag=true;
                Storage.setUserCookie(null)
                Storage.setUserAccountInfo(null)
                Event.emit('didLogin');
                this.cancel()
                wx.reLaunch({
                    url:'../../index/index'
                })
            }

        };
        r.addToQueue();
    },
    //取消
    cancel(){
        this.setData({
            isLoginOut:false
        })
    },
    onLoad: function (options) {
      this.refreshMemberInfoNotice()
      Event.on('refreshMemberInfoNotice', this.refreshMemberInfoNotice, this);
    },
    refreshMemberInfoNotice() {
      Tool.getUserInfos(this)
    },
    onUnload: function () {
      Event.off('refreshMemberInfoNotice', this.refreshMemberInfoNotice);
    }
})