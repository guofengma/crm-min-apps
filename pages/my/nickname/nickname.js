// pages/my/account.js
let { Tool, RequestFactory, Storage, Event } = global;
Page({
    data: {
      nickname:''
    },
    onLoad: function (options) {
     
    },
    inputChange(e){
      this.setData({
        nickname: e.detail.value
      })
      
    },
    updateDealerNickname() {
      if (Tool.isEmptyStr(this.data.nickname)){
        Tool.showAlert('请输入昵称')
        return
      }
      if (this.data.nickname.length){
        Tool.showAlert('昵称不能多于16个字')
        return
      }
      let params = {
        nickname: this.data.nickname
      }
      let r = RequestFactory.updateDealerNickname(params);
      r.finishBlock = (req) => {
        Storage.setUserAccountInfo(req.responseObject.data)
        Event.emit('refreshMemberInfoNotice');//发出通知
        Tool.navigationPop()
      };
      Tool.showErrMsg(r)
      r.addToQueue();
    }
})