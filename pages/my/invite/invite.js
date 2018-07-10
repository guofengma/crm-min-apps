// pages/my/account.js
let {Tool, RequestFactory, Event} = global;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        expanded:[false,false],
        token:''
    },
    press(){
        wx.previewImage({
            current: '/img/code.png', // 当前显示图片的http链接
            urls: ['/img/code.png'] // 需要预览的图片http链接列表
        })
    },
    onLoad: function (options) {
      this.getAccessToken()
    },
    getAccessToken(){
      let that = this
      wx.request({
        url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx228ac7ba52b9b1ed&secret=ac645290e3299966fabe3cf0d0034f9b',
        dataType: 'json',
        success: function (res) {
          that.setData({
            token:res.data.access_token
          })
          //that.getCode()
        }
      });
    },
    getCode(){
      let that = this
      let params = {
        path:'pages/register/register?id=1111111',
        width:430,
        auto_color:false,
        line_color: { "r": "0", "g": "0", "b": "0" },
        is_hyaline:false
      }
      wx.request({
        url: 'https://api.weixin.qq.com/wxa/getwxacode?access_token=' +this.data.token,
        dataType: 'json',
        method: 'POST',
        data: params,
        header: {
          'content-type': "application/json"
        },
        success: function (res) {
          that.setData({
            img:res.data
          })
        }
      });
    }
})