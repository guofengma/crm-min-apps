// pages/my/account.js
let {Tool, RequestFactory, Event} = global;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        expanded:[false,false],
        token:'',
        imgUrl:''
    },
    press(){
        wx.previewImage({
          current: this.data.imgUrl, // 当前显示图片的http链接
          urls: [this.data.imgUrl] // 需要预览的图片http链接列表
        })
    },
    onLoad: function (options) {
      this.refreshMemberInfoNotice()
      this.createWxQrcode()
      Event.on('refreshMemberInfoNotice', this.refreshMemberInfoNotice, this);
    },
    refreshMemberInfoNotice() {
      Tool.getUserInfos(this)
    },
    createWxQrcode(){
      // 获取邀请码
      let r = RequestFactory.createWxQrcode();
      r.finishBlock = (req) => {
        this.setData({
          imgUrl: req.responseObject.data.wxQrcode,
          inviteId: req.responseObject.data.inviteId
        })
      }
      Tool.showErrMsg(r)
      r.addToQueue();
    },
    saveImgToPhotosAlbumTap() {
      if (Tool.isEmptyStr(this.data.imgUrl)){
        return
      }
      wx.downloadFile({
        url: this.data.imgUrl,
        success: function (res) {
          //图片保存到本地
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: function (data) {
              Tool.showSuccessToast('保存成功')
            },
            fail: function (err) {
              console.log(err);
              if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
                console.log("当初用户拒绝，再次发起授权")
                wx.openSetting({
                  success(settingdata) {
                    console.log(settingdata)
                    if (settingdata.authSetting['scope.writePhotosAlbum']) {
                      console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                    } else {
                      console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                    }
                  }
                })
              }
            },
            complete(res) {
              console.log(res);
            }
          })
        }
      })
    },
    onShareAppMessage: function (res) {
      if (res.from === 'button') {
        // 来自页面内转发按钮
        console.log(res.target)
      }
      return {
        title: "飓热小程序",
        path: '/pages/register/register?id' + this.data.inviteId,
        imgUrl: this.data.imgUrl
      }
    },
    onUnload: function () {
      Event.off('refreshMemberInfoNotice', this.refreshMemberInfoNotice);
    }
})