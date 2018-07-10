let {Tool, RequestFactory} = global;

Page({
    data: {
      list:''
    },
    onLoad: function (options) {
      this.queryHelpQuestionList()
    },
    queryHelpQuestionList(){
      let r = RequestFactory.queryHelpQuestionList();
      r.finishBlock = (req) => {
        let data = req.responseObject.data ? req.responseObject.data : {}
        let typeList = req.responseObject.data.typeList
        let list = req.responseObject.data.list
        let listArr =[]
        for (let i = 0; i < typeList.length;i++){
          let arr =[]
          for (let j = 0; j < list.length; j++) {
            if (list[j].name == typeList[i].name){
              arr.push(list[j])
            }
          }
          if(arr.length>0){
            listArr.push({ name: typeList[i].name, list: arr, typeid: typeList[i].id})
          }         
        }
        this.setData({
          list: listArr
        })
      }
      
      r.addToQueue();
    },
    
    //跳到详情页
    toDetail(e) {
      let id = e.currentTarget.dataset.id
      Tool.navigateTo('/pages/my/help-customer/questionDetail/questionDetail?id='+id)
    },
    //跳到问题反馈页面
    questionFeedback(){
        Tool.navigateTo('questionFeedback/questionFeedback')
    },
    //跳到问题列表页面
    questionList(e){
      let id = e.currentTarget.dataset.typeid
      Tool.navigateTo('questionList/questionList?id='+id)
    },
    onUnload: function () {
    }
})