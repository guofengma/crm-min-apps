let { Tool, RequestFactory } = global

Page({
  data: {
    innerCount:1,
    chooseImgShow:[], // 保存勾选的个数
    selectAll:false, //是否全选
    cartList:[1]
  },
  onLoad: function (options) {
  
  },
  onShow: function () {
  
  },
  chooseClicked(e){
    let index = e.currentTarget.dataset.index 
    let activeArr = this.data.chooseImgShow
    if (activeArr[index] === undefined){
      activeArr[index] = false
    }
    activeArr[index] = !activeArr[index]
    this.setData({
      chooseImgShow:activeArr
    })
  },
  cartProductClicked(e){
    let index = e.currentTarget.dataset.index
    console.log(index)
  },
  counterInputOnChange(e) {
    let count = e.detail.innerCount;
    this.setData({
      innerCount: count,
    })
    this.triggerEvent('counterInputOnChange', this.data.innerCount);
  },
  deleteCart(e){
    wx.showModal({
      title: '提示',
      content: '确定删除吗？',
      success: function (res) {
        if (res.confirm) {
          // let r = RequestFactory.deleteCart(requestData);
          // r.finishBlock = (req) => {
          // }
          // r.addToQueue();
        }
      }
    })
  },
  selectAllClicked(){
    let activeArr =[]
    for (let i = 0; i < this.data.cartList.length;i++){
      activeArr[i] = true
    }
    this.setData({
      selectAll: !this.data.selectAll,
      chooseImgShow: activeArr
    })
  }
})