let { Tool, RequestFactory } = global

Page({
  data: {
    innerCount:[1,1],
    chooseImgShow:[], // 保存勾选的个数
    selectAll:false, //是否全选
    items:[
      { isTouchMove:false},
      { isTouchMove: false }
    ], // 保存购物车的数据
    itemIndex:0,
  },
  onLoad: function (options) {
    
  },
  onShow: function () {

  },
  deleteClicked(e){
    let items = e.detail.items
    if (e.detail.index !== undefined){
      // this.deleteCart(items,index)
    }
    this.setData({
      items: items
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
    // 数量变化的时候 
    let count = e.detail.innerCount;
    let index = e.detail.e.currentTarget.dataset.index
    if(index !== undefined){
      let innerCount = this.data.innerCount
      innerCount[index] = count
      this.setData({
        innerCount: innerCount
      })
    }
  },
  deleteCart(items,index){
    // 删除购物车
    let r = RequestFactory.deleteCart(requestData);
    r.finishBlock = (req) => {
      items.splice(e.detail.index, 1)
      this.setData({
        items: items
      })
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