// pages/my/account.js
let { Tool, RequestFactory, Storage, Event } = global;
Page({
    data: {

    },
    onLoad: function (options) {
     
    },
    inputChange(e){
      this.setData({
        nickname: e.detail.value
      })
      
    },
    updateDealerNickname() {
      let params = {
        nickname: this.data.nickname
      }
      let r = RequestFactory.updateDealerNickname(params);
      r.finishBlock = (req) => {
        Storage.setUserAccountInfo(req.responseObject.data)
        Event.emit('refreshMemberInfoNotice');//发出通知
        Tool.navigationPop()
      };
      r.addToQueue();
    }
})