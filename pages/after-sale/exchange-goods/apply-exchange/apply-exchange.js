let { Tool, RequestFactory } = global

Page({
  data: {
    addressType:1,
    hidden:false,
    reason:{
      title:'换货原因',
      list:['七天无理由退换货','规格不符合','质量存在问题']
    },
    activeIndex:''
  },
  onLoad: function (options) {
  
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
  typeSubClicked(e){

  },
  counterInputOnChange(e){
    
  }
})