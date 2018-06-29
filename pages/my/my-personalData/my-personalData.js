// pages/my/account.js
let { Tool, RequestFactory, Event } = global;
Page({
    data: {
      userInfos: ''
    },
    nickname(){
      Tool.navigateTo('/pages/my/nickname/nickname')
     
    },
    onLoad: function (options) {
      Tool.getUserInfos(this)
    },
    modifyImageTap: function () {
      let self = this;
      wx.chooseImage({
        count: 1, // 默认9
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          var tempFilePaths = res.tempFilePaths;
          self.setData({
            imageUrl: tempFilePaths[0],
          });
          wx.uploadFile({
            url: RequestFactory.aliyunOSSUploadImage(), 
            filePath: tempFilePaths[0],
            name: 'file',
            success: function (res) {
              let fileInfo = JSON.parse(res.data);
              let temporaryId = fileInfo.data.imageUrl;//临时Id
              let params = {
                headImg: temporaryId
              }
              let r = RequestFactory.updateDealerHeadImg(params);
              r.finishBlock = (req) => {
                // Storage.setUserAccountInfo(req.responseObject.data)
                Event.emit('refreshMemberInfoNotice');//发出通知
                Tool.navigationPop()
              };
              r.addToQueue();
            }
          })
        },
      })
    },
    realName(){
      if (!this.data.userInfos.isRealname){
        Tool.redirectTo('/pages/real-name/real-name')
      }
    }
})