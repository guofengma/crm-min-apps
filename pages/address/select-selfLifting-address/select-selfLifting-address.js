let { Tool, RequestFactory} = global
Page({
  data: {
    ysf: { title: '自提地址管理' },
    addressList:[],
    addressType:2,
    active:true
  },
  onLoad: function (options) {
    this.queryStoreHouseList()
  },
  onShow: function () {
    
  },
  queryStoreHouseList(){
    let r = RequestFactory.queryStoreHouseList();
    r.finishBlock = (req) => {
      if (req.responseObject.data.length > 0) {
        this.setData({
          addressList: req.responseObject.data
        })
      }
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  }
})