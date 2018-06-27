let { Tool, RequestFactory, Event} = global

Page({
  data: {
      region: [],
      receiver:'',
      recevicePhone:'',
      address:'',
      addressList:{},
      id:''
  },
  onLoad: function (options) {
    // 如果有参数 就编辑地址 无参数就创建地址
    let list = options.address
    if (list !== undefined){
      list = JSON.parse(options.address)
      let region = this.data.region
      region[0] = { name: list.province, zipcode: list.provinceCode}
      region[1] = { name: list.city, zipcode: list.cityCode }
      region[2] = { name: list.city, zipcode: list.areaCode }
      this.setData({
        receiver: list.receiver,
        recevicePhone: list.recevicePhone,
        address: list.address,
        region: region,
        id:list.id
      })
    }
    
  },
  onShow: function () {

  },
  pickerClicked(e) {
    this.setData({
        region: e.detail.result
    })
  },
  formSubmit(e) {
      let params = e.detail.value;
      if (this.data.region[0]) {
          params.provinceCode = this.data.region[0].zipcode;
      }
      if (this.data.region[1]) {
          params.cityCode = this.data.region[1].zipcode;
      }
      if (this.data.region[2]) {
          params.areaCode = this.data.region[2].zipcode;
      }
      // 获取用户ID
      // params.id = Storage.memberId();
      console.log(params);
      if (!Tool.checkName(params.receiver)) {
          Tool.showAlert("请输入正确的中文姓名");
          return
      }
      if (!Tool.checkPhone(params.recevicePhone)) {
          Tool.showAlert("请输入正确的电话号码");
          return
      }
      if (this.data.region.length == 0) {
          Tool.showAlert("请选择你所在的省市区");
          return
      }
      if (Tool.isEmptyStr(params.address)) {
          Tool.showAlert("请输入详细地址");
          return
      }
      if(this.data.id){
        // 更新地址
        this.updateUserAddress(params)
      } else {
        this.requestAddUserAddress(params)
      }
      
  },
  updateUserAddress(params){
    params.id = this.data.id
    let r = RequestFactory.updateUserAddress(params);
    r.finishBlock = (req) => {
      //跳转到地址列表页面
      this.successCallBack('修改成功')
    };
    r.addToQueue();
  },
  requestAddUserAddress(params) {
      let r = RequestFactory.addUserAddress(params);
      r.finishBlock = (req) => {
          //跳转到地址列表页面
          this.successCallBack("添加成功")
      };
      r.addToQueue();
  },
  successCallBack(title){
    Event.emit('updateAdressList');//发出通知
    let  callBack  = () => {
      Tool.navigationPop()
    }  
    Tool.showSuccessToast(title, callBack)
  }  
})