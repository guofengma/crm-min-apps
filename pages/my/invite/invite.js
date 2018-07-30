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
      // 保存图片到本地
      if (Tool.isEmptyStr(this.data.imgUrl)){
        return
      }
      wx.downloadFile({
        url: this.data.imgUrl,
        success(res) {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success(res) {
              console.log(res)
            },
            fail (res) {
              console.log(res)
            }
          })
        },
        fail() {
          console.log('fail')
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