let { Tool, RequestFactory} = global
Page({
  data: {
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
    r.addToQueue();
  }
})