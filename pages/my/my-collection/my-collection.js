let { Tool, RequestFactory, Storage, Event } = global

Page({
  data: {
    productList: []
  },
  onLoad: function (options) {
    Event.on('updateCollectionPrd', this.getCollectionPrd, this)
    this.getCollectionPrd()
  },
  onShow: function () {

  },
  getCollectionPrd() {
    let r = RequestFactory.queryProductFaviconList();
    r.finishBlock = (req) => {
      let data = req.responseObject.data ? req.responseObject.data:[]
      if(data.length>0){
        data.forEach((item)=>{
          item.isTouchMove = false
        })
        this.setData({
          productList: data
        })
      }
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  deleteClicked(e) {
    let items = e.detail.items
    let index = e.detail.index
    if (index !== undefined) {
      let params = {
        productId: items[index].id,
      }
      let r = RequestFactory.deleteProductFavicon(params);
      r.finishBlock = (req) => {
        items.splice(index, 1)
        this.setData({
          productList: items
        })
      };
      Tool.showErrMsg(r)
      r.addToQueue();
    }
    this.setData({
      productList: items
    })
  },
  productClicked(e){
    let state = e.currentTarget.dataset.state
    let id = e.currentTarget.dataset.id
    if(state ==4){
      Tool.navigateTo('/pages/product-detail/product-detail?productId=' + id)
    }
  },
  onUnload: function () {
    Event.off('updateCollectionPrd', this.getCollectionPrd);
  }
})