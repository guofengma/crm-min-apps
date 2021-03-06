let {Tool, RequestFactory} = global;

import WxParse from '../../../../libs/wxParse/wxParse.js';

Page({
    data: {
      
    },
    onLoad: function (options) {
      this.findHelpQuestionById(options.id)
    },
    isUseClicked(e){
      let params = {
        id:this.data.list.id
      }
      let index = e.currentTarget.dataset.index
      if(index==1){
        params.helpNoNum = 1
      } else {
        params.helpYesNum = 1
      }
      let r = RequestFactory.updateHelpQuestion(params);
      r.finishBlock = (req) => {
        Tool.showSuccessToast('感谢您的评价')
      }
      Tool.showErrMsg(r)
      r.addToQueue();
    },
    findHelpQuestionById(id) {
      let params = {
        id:id
      }
      let r = RequestFactory.findHelpQuestionById(params);
      r.finishBlock = (req) => {
        this.setData({
          list: req.responseObject.data
        })
        let html = req.responseObject.data.content
        WxParse.wxParse('article', 'html', html, this, 5);
      }
      Tool.showErrMsg(r)
      r.addToQueue();
    },
    onUnload: function () {

    }
})