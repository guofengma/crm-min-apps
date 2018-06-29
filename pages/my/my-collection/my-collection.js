let { Tool, RequestFactory, Storage, Event } = global

Page({
  data: {
    productList: [
      { isTouchMove: false },
      { isTouchMove: false }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    Event.on('updateCollectionPrd', this.getCollectionPrd, this)
  },
  onShow: function () {

  },
  getCollectionPrd() {
    console.log(111111)
  },
  deleteClicked(e) {
    console.log(e)
    let items = e.detail.items
    if (e.detail.index !== undefined) {

    }
    this.setData({
      productList: items
    })
  },
  onUnload: function () {
    Event.off('updateCollectionPrd', this.getCollectionPrd);
  }
})