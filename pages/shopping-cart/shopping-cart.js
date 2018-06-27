let { Tool, RequestFactory } = global

Page({
  data: {
    innerCount:[1,1],
    chooseImgShow:[], // 保存勾选的个数
    selectAll:false, //是否全选
    cartList:[1],
    items:[
      { isTouchMove:false},
      { isTouchMove: false }
    ],
    itemIndex:0,
  },
  onLoad: function (options) {
    
  },
  onShow: function () {

  },
  deleteClicked(e){
    let n = e.detail
    this.setData({
      items: e.detail
    })
  },
  chooseClicked(e){
    // 点击选择
    let index = e.currentTarget.dataset.index 
    let selectAll = false 
    let selectAllArr = []
    let activeArr = this.data.chooseImgShow
    if (activeArr[index] === undefined){
      activeArr[index] = false
    }
    activeArr[index] = !activeArr[index]

    for (let i = 0; i < activeArr.length; i++) {
      if (activeArr[i] === true) {
        selectAllArr.push(activeArr[i])
      }
    }
    if (selectAllArr.length == this.data.items.length) {
      selectAll = true
    }

    this.setData({
      chooseImgShow:activeArr,
      selectAll: selectAll
    })
  },
  cartProductClicked(e){
    let index = e.currentTarget.dataset.index
  },
  counterInputOnChange(e) {
    let count = e.detail.innerCount;
    let index = e.detail.e.currentTarget.dataset.index
    console.log(e.detail.e.currentTarget.dataset)
    if(index !== undefined){
      let innerCount = this.data.innerCount
      innerCount[index] = count
      this.setData({
        innerCount: innerCount
      })
    }
   
    console.log(e.detail.e)
  },
  deleteCart(e){
    let r = RequestFactory.deleteCart(requestData);
    r.finishBlock = (req) => {

    }
    r.addToQueue();
  },
  selectAllClicked(){
    //点击全选 
    let activeArr = []
    if (!this.data.selectAll){
      for (let i = 0; i < this.data.items.length; i++) {
        activeArr[i] = true
      }
    } 
    this.setData({
      selectAll: !this.data.selectAll,
      chooseImgShow: activeArr
    })
  }
})