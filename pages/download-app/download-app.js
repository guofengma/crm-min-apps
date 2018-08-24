// pages/download-app.js
Page({
  data: {
    ysf: { title: 'app下载提示页' },
  },

  onLoad: function (options) {
    this.setData({
      door: options.door || '',
      title: options.title || '',
    })
  },

  onShow: function () {

  },
  
})