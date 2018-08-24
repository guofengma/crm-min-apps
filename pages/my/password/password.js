let { Tool, RequestFactory, Storage, Event } = global

Page({
    data: {
      ysf: { title: '修改密码' },
      reNew:'',
      old:'',
      newPwd:'',
      isFinished:false,
    },
    onLoad: function (options) {

    },
    changeReNewPwd(e){
      this.setData({
        reNew: e.detail.value
      })
      this.isAllwrite()
    },
    changeOldPwd(e) {
      this.setData({
        old: e.detail.value
      })
      this.isAllwrite()
    },
    changeNewPwd(e) {
      this.setData({
        newPwd: e.detail.value
      })
      this.isAllwrite()
    },
    isAllwrite(){
      let isFinished = false 
      if (!Tool.isEmptyStr(this.data.reNew) && !Tool.isEmptyStr(this.data.newPwd) && !Tool.isEmptyStr(this.data.old)){
        isFinished = true
      }
      this.setData({
        isFinished: isFinished
      })
    },
    updateDealerPassword(){
      if (this.data.newPwd !== this.data.newPwd){
        Tool.showAlert('两次输入密码不一致')
        return
      }
      if (!Tool.checkPwd(this.data.newPwd)) {
        Tool.showAlert("密码格式不正确");
        return
      }
      let params = {
        oldPassword: this.data.old,
        newPassword: this.data.newPwd
      }
      let r = RequestFactory.updateDealerPassword(params);
      r.finishBlock = (req) => {
        Tool.navigationPop()
      };
      r.failBlock = (req) => {
        Tool.showAlert(req.responseObject.msg)
      }
      Tool.showErrMsg(r)
      r.addToQueue();
    }
})