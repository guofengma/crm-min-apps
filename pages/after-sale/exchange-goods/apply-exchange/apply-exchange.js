let { Tool, RequestFactory, Storage } = global

Page({
  data: {
    addressType:1,
    hidden:false,
    reason:{
      title:'换货原因',
      list:['七天无理由退换货','规格不符合','质量存在问题']
    },
    activeIndex: '',
    originalImg: [],
    smallImg: [],
    remark: '',
    list:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      list: Storage.getInnerOrderList() || ''
    })
  },
  chooseReason() {
    this.setData({
      hidden: !this.data.hidden
    })
  },
  makeSureReason(e) {
    this.setData({
      activeIndex: e.detail.activeIndex,
      hidden: e.detail.hidden
    })
  },
  applyExchangeProduct() {
    let list = this.data.list
    let params = {
      imgUrls: this.data.originalImg.join(','),
      orderProductId: list.id,
      remark: this.data.remark,
      returnReason: this.data.reason.list[this.data.activeIndex],
      smallImgUrls: this.data.smallImg.join(','),
    };
    let r = RequestFactory.applyExchangeProduct(params)
    r.finishBlock = (req) => {

    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  uploadImage(e) {
    this.setData({
      originalImg: e.detail.originalImg,
      smallImg: e.detail.smallImg,
    })
  },
  inputChange(e) {
    this.setData({
      remark: e.detail.value
    })
  }
})