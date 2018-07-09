let { Tool, RequestFactory, Storage, Event } = global

Page({
  data: {
    didLogin:false,
    selectAll:false, //是否全选
    items:[], // 保存购物车的数据
    totalPrice:0, // 总价
    selectList:[], //选中的产品
    tipVal:''
  },
  onLoad: function (options) {
    this.getLoginCart()
    Event.on('updateShoppingCart', this.getShoppingCartList, this)
    Event.on('updateStorageShoppingCart', this.getStorageShoppingCart, this)
    Event.on('didLogin', this.getLoginCart, this);
  },
  onShow: function () {

  },
  getLoginCart(){
    Tool.didLogin(this)
    if (this.data.didLogin) {
      let hasStorageShoppingCart = this.hasStorageShoppingCart()
      if (hasStorageShoppingCart){
        this.shoppingCartLimit()
      } else {
        this.getShoppingCartList()
      }
    } else {
      this.getStorageShoppingCart()
    }
  },
  hasStorageShoppingCart(){
    let list = Storage.getShoppingCart()
    if(list){
      return true
    } else {
      return false 
    }
  },
  getFormCookieToSessionParams(){
    let list = Storage.getShoppingCart()
    if (!list) return
    let isArrParams = []
    for (let i = 0; i < list.length; i++) {
      isArrParams.push({
        productId: list[i].productId, sareSpecId: list[i].sareSpecId, productNumber: list[i].showCount
      })
    }
    return JSON.stringify(isArrParams)
  },
  shoppingCartLimit(){
    let isArrParams = this.getFormCookieToSessionParams()
    let params = { jsonString: isArrParams}

    let r = RequestFactory.shoppingCartLimit(params);
    r.finishBlock = (req) => {
      this.shoppingCartFormCookieToSession(params)
    };
    r.failBlock = (req) => {
      if (req.responseObject.code == 600) {
        // 本地购物车数量和服务器数量的和 超过上限
        let that = this
        let callBack = () =>{
          that.shoppingCartFormCookieToSession(params)
        }
        Tool.showComfirm(req.responseObject.msg, callBack)
      }
    }
    r.addToQueue();

  },
  shoppingCartFormCookieToSession(params){

    // 同步本地购物车到服务器
    let r = RequestFactory.shoppingCartFormCookieToSession(params);
    r.finishBlock = (req) => {
      Storage.clearShoppingCart()
      this.getShoppingCartList()
    };
    r.addToQueue();
  },
  getStorageShoppingCart(){   
    let list = Storage.getShoppingCart()
    if(list){
      this.setData({
        items:list,
      }) 
      this.getTotalPrice()
    } else {
      this.setData({
        tipVal: 2
      })
    }
  },
  updateStorageShoppingCart(count, index){
    let list = this.data.items
    list[index].showCount = count
    this.setData({
      items: list,
    })
    this.getTotalPrice()
    Storage.setShoppingCart(list)
  },
  updateShoppingCart(count,index){
    // 更新购物车
    let prd = this.data.items[index]
    let params = {
      sareSpecId: prd.id,
      productNumber: count
    }
    let r = RequestFactory.updateShoppingCart(params);
    r.finishBlock = (req) => {
      let list = this.data.items
      list[index].showCount = count
      this.setData({
        items: list
      })
      this.getTotalPrice()
    };
    r.addToQueue();
  },
  getShoppingCartList(){
    // 查询购物车
    let r = RequestFactory.getShoppingCartList();
    r.finishBlock = (req) => {
      let data = req.responseObject.data
      data = data ===null? []:data
      if(data.length>0){
        data.forEach((item, index) => {
          item.isTouchMove = false  //是否移动 
          item.showImg = item.spec_img
          item.showPrice = item.levelPrice
          item.showName = item.name
          item.showType = item.spec
          item.showCount = item.productNumber || 1  // 商品数量
          item.isSelect = false  //是否选择 
        })
        this.setData({
          items: data
        })
        this.getTotalPrice()
      } else {
        this.setData({
          tipVal: 2
        })
      }
    };
    r.addToQueue();
  },
  deleteClicked(e){
    let items = e.detail.items
    if (e.detail.index !== undefined){
      if(!this.data.didLogin){
        this.deleteStorageShoppingCart(e.detail.index)
        return 
      }
      this.deleteCart(items, e.detail.index)
    }
    this.setData({
      items: items
    })
    this.getTotalPrice()
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
    let selectList = []
    let totalPrice = 0
    for (let i = 0; i<items.length;i++){
      if (items[i].isSelect){
        totalPrice += items[i].showCount * items[i].showPrice
        let list = { "price_id": items[i].id, "num": items[i].showCount }
        selectList.push(list)
      }
    }
    this.setData({
      totalPrice: totalPrice,
      selectList: selectList
    })
  },
  cartProductClicked(e){
    let index = e.currentTarget.dataset.index
  },
  counterInputOnChange(e) {
    // 数量变化的时候 
    let count = e.detail.innerCount;
    let index = e.detail.e.currentTarget.dataset.index
    let btnName = e.detail.e.currentTarget.dataset.name
    let list = this.data.items
    
    // 本次修改和上次修改一样的情况

    if (list[index].showCount == count) return

    //收到输入为空和0 的情况 

    if (!count || count == 0) return

    // 如果产品的数量是1 点击了减按钮 那么不做操作

    if (list[index].stock < count){
      Tool.showAlert('库存不足')
      return
    }
    //数量为1的情况下不让减

    if (btnName == 'reduce' && list[index].showCount == 1) return 

    if (index !== undefined){
      if(!this.data.didLogin){
        this.updateStorageShoppingCart(count, index)
      } else {
        this.updateShoppingCart(count, index)
      }  
    }
    this.getTotalPrice()
  },
  deleteCart(items,index){
    // 删除购物车
    let params = {
      sareSpecId: items[index].id,
    }
    let r = RequestFactory.deleteFromShoppingCart(params);
    r.finishBlock = (req) => {
      items.splice(index, 1)
      this.setData({
        items: items
      })
      this.getTotalPrice()
    };
    r.addToQueue();
  },
  deleteStorageShoppingCart(index){
    let list = this.data.items
    list.splice(index,1)
    this.setData({
      items: list,
    })
    this.getTotalPrice()
    Storage.setShoppingCart(list)
  },
  selectAllClicked(){
    //点击全选 
    let items = this.data.items
    let selectAll = this.data.selectAll
    for (let i = 0; i < items.length; i++) {
      items[i].isSelect = !selectAll
    }
    this.setData({
      selectAll: !selectAll,
      items: items
    })
    this.getTotalPrice()
  },
  makeOrder(){
    let params = JSON.stringify(this.data.selectList)
    
    // 如果没有登录 那么就跳转到登录页面
    
    if(!this.data.didLogin){
      Tool.navigateTo('/pages/login/login-wx/login-wx?isBack=' + true)
      return
    }
    if (this.data.selectList.length==0){
      Tool.showAlert('请选择要购买的商品')
      return
    }
    
    Tool.navigateTo('/pages/order-confirm/order-confirm?params=' + params+'&type=2')
  },
  cartProductClicked(e){
    Tool.navigateTo('/pages/product-detail/product-detail?productId=' + e.currentTarget.dataset.id)
  },
  onUnload: function () {
    Event.off('updateStorageShoppingCart', this.getStorageShoppingCart);
    Event.off('updateShoppingCart', this.getShoppingCartList);
    Event.off('didLogin', this.didLogin);
  },
  test(){
    // 阻止冒泡 
    console.log('阻止冒泡')
  }
})