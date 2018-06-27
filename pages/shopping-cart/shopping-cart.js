let { Tool, RequestFactory, Storage, Event } = global

Page({
  data: {
    innerCount:[],
    didLogin:false,
    selectAll:false, //是否全选
    items:[], // 保存购物车的数据
    itemIndex:0,
    totalPrice:0, // 总价
  },
  onLoad: function (options) {
    let didLogin = Storage.getUserCookie() ? true : false
    this.setData({
      didLogin: didLogin
    })
    if (this.data.didLogin){
      this.getShoppingCartList()
    } else {
      this.getStorageShoppingCart()
    }
    
    Event.on('updateShoppingCart', this.getShoppingCartList, this)
    Event.on('updateStorageShoppingCart', this.getStorageShoppingCart, this)
  },
  onShow: function () {

  },
  getStorageShoppingCart(){   
    let list = Storage.getShoppingCart()
    let innerCount = []
    if(list){
      for (let i = 0; i < list.length; i++) {
        innerCount.push(list[i].productNumber)
      }
      this.setData({
        items:list,
        innerCount: innerCount
      })
      
    }
  },
  updateStorageShoppingCart(count, index){
    let list = this.data.items
    let innerCount = this.data.innerCount
    list[index].productNumber = count
    innerCount[index] = count
    this.setData({
      items: list,
      innerCount: innerCount
    })
    Storage.setShoppingCart(list)
  },
  updateShoppingCart(count,index){
    // 更新购物车
    let prd = this.data.items[index]
    let params = {
      productId: prd.product.id,
      productNumber: count
    }
    let r = RequestFactory.updateShoppingCart(params);
    r.finishBlock = (req) => {
      let innerCount = this.data.innerCount
      innerCount[index] = count
      this.setData({
        innerCount: innerCount
      })
    };
    r.addToQueue();
  },
  getShoppingCartList(){
    // 查询购物车
    let innerCount = []
    let r = RequestFactory.getShoppingCartList();
    r.finishBlock = (req) => {
      let data = req.responseObject.data
      data.forEach((item,index)=>{
        item.isTouchMove = false
        item.showImg = item.ImgUrl[0].small_img
        item.showPrice = item.priceList.levelPrice
        item.showName = item.product.name
        item.showType = item.priceList.spec  
        innerCount.push(item.priceList.productNumber|| 1) // 购物车的数量
        item.isSelect = false  //是否选择 
      })
      this.setData({
        items: data,
        innerCount: innerCount
      })
    };
    r.addToQueue();
  },
  deleteClicked(e){
    let items = e.detail.items
    if (e.detail.index !== undefined){
      this.deleteCart(items, e.detail.index)
    }
    this.setData({
      items: items
    })
  },
  chooseClicked(e){
    // 点击选择
    let index = e.currentTarget.dataset.index 
    let prdList = this.data.items
    prdList[index].isSelect = !prdList[index].isSelect
    let selectAllArr = []
    let selectAll = false 
    for (let i = 0; i < prdList.length; i++) {
      if (prdList[i].isSelect === true) {
        selectAllArr.push(prdList[i])
      }
    }
    if (selectAllArr.length == prdList.length) {
      selectAll = true
    }
    this.setData({
      items: prdList,
      selectAll: selectAll
    })
    this.getTotalPrice()
  },
  getTotalPrice(index){
    let items = this.data.items
    let totalPrice = 0
    for (let i = 0; i<items.length;i++){
      if (items[i].isSelect){
        totalPrice += items[i].priceList.productNumber * items[i].showPrice
      }
    }
    this.setData({
      totalPrice: totalPrice
    })
  },
  cartProductClicked(e){
    let index = e.currentTarget.dataset.index
  },
  counterInputOnChange(e) {
    // 数量变化的时候 
    let count = e.detail.innerCount;
    let index = e.detail.e.currentTarget.dataset.index
    if (index !== undefined){
      if(!this.data.didLogin){
        this.updateStorageShoppingCart(count, index)
        return
      }
      this.updateShoppingCart(count,index)
    }
  },
  deleteCart(items,index){
    // 删除购物车
    let params = {
      productId: items[index].product.id,
    }
    let r = RequestFactory.deleteFromShoppingCart(params);
    r.finishBlock = (req) => {
      items.splice(index, 1)
      this.setData({
        items: items
      })
    };
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