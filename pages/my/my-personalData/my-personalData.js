// pages/my/account.js
let { Tool, RequestFactory, Event, Storage } = global;
Page({
    data: {
      userInfos: '',
      region:''
    },
    nickname(){
      Tool.navigateTo('/pages/my/nickname/nickname')
     
    },
    onLoad: function (options) {
      Event.on('refreshMemberInfoNotice', this.refreshMemberInfoNotice, this);
      this.refreshMemberInfoNotice()
    },
    refreshMemberInfoNotice(){
      Tool.getUserInfos(this)
    },
    pickerClicked(e) {
      this.setData({
        region: e.detail.result
      })
      if (e.detail.btnType == 2){
        this.updateDealerRegion(e)
      } 
    },
    updateDealerRegion(e){
      let params = {
        provinceId: this.data.region[0].zipcode,
        cityId: this.data.region[1].zipcode,
        areaId: this.data.region[2].zipcode,
      }
      let r = RequestFactory.updateDealerRegion(params);
      r.finishBlock = (req) => {
        Storage.setUserAccountInfo(req.responseObject.data)
        Event.emit('refreshMemberInfoNotice');//发出通知
        //Tool.navigationPop()
      };
      r.addToQueue();
    },
    modifyImageTap: function () {
      let callBack = (fileInfo) => {
        let temporaryId = fileInfo.data.imageUrl;//临时Id
        let params = {
          headImg: temporaryId
        }
        let r = RequestFactory.updateDealerHeadImg(params);
        r.finishBlock = (req) => {
          Storage.setUserAccountInfo(req.responseObject.data)
          Event.emit('refreshMemberInfoNotice');
        };
        Tool.showErrMsg(r)
        r.addToQueue();
      }
      Tool.uploadImage(1, callBack)
    },
    realName(){
      if (!this.data.userInfos.isRealname){
        Tool.redirectTo('/pages/real-name/real-name')
      }
    }
})