let { Tool, RequestFactory } = global;
Page({
  data: {
    topicImgUrl:'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
    topicTemplateId:1, // 模板id 
    topicInfos:{}, //专题信息
    topicDetailList:[], //换题产品信息
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
  },
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    this.getTopicDetail()
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    let cur = e.target.dataset.current;
    if (this.data.currentTab == cur) {
      return false;
    }
    else {
      this.setData({
        currentTab: cur
      })
    }
  },
  getTopicDetail(){
    let params = {
      id: this.data.id
    };
    let r = RequestFactory.getTopicDetail(params);
    r.finishBlock = (req) => {
      let data = req.responseObject.data
      if (data){
        this.setData({
          topicTemplateId: data.templateId,
          topicDetailList: data.content,
          topicInfos: data
        })
      }
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  }
})