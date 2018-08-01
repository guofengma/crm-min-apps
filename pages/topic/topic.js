let { Tool, RequestFactory } = global;
Page({
  data: {
    topicImgUrl:'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
    topicTemplateId:1, // 模板id 
    topicInfos:{}, //专题信息
    topicDetailList:[], //换题产品信息
  },
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    this.getTopicDetail()
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
          topicTemplateId: data.topicTemplateId,
          topicDetailList: data.topicDetailList,
          topicInfos: data
        })
      }
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  }
})