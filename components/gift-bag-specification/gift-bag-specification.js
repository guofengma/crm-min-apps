let { Tool, RequestFactory } = global
Component({
  properties: {
    productTypeList:Array,
    priceList: Array,
    productInfo:Object,
    imgUrl:String,
    types:Number,
    showImgs:Boolean,
    giftPrice:Number
  },
  data: {
    visiable:false,
    isSelect:false,// 是否选择了商品类型
    productType: '',  // 已选择的类型
    isActive:[{index:'',val:''}],
    selectPrdList:{}, //已选的类型的商品价格等信息
    tips:''// 提示语
  },
  methods: {
    makeSureType(show){
      // 点击确定 
      if (!this.isSelectAll()) return
      let isActive = this.data.isActive
      let productType = []
      let priceList = []
      isActive.forEach((item, index) => {
        productType.push(item.spec)
        item.num=1
        priceList.push({
          ...item
        })
      })

      // 如果被选择的库存小于用户输入的库存 发生在先选择数量再选择规格的情况下
      if (this.data.selectPrdList.stock < this.data.innerCount) {
        this.setData({
          innerCount: this.data.selectPrdList.stock,
        })
      }
      // 已选择的类型
      productType = '已选："' + productType.join('""') + '"'
      this.setData({
        productType: productType
      })
      if(show != true){
        this.triggerEvent('subClicked', { productType, priceList });
        this.isVisiableClicked()
      }
    },
    typeListClicked(e){

      // 选择的类型 使其 active
      let stock = e.currentTarget.dataset.stock
      if (stock==0) return
      let key = e.currentTarget.dataset.type
      let index = e.currentTarget.dataset.index
      let val = e.currentTarget.dataset.typename // 名称
      let id = e.currentTarget.dataset.id //价格id
      // 深复制数组
      let obj = [...this.data.isActive]
      let item = this.data.productTypeList[key].value[index]
      console.log(item)
      obj[key] = { index,...item}
      this.setData({
        isActive: obj
      })
      if (this.isSelectAll()){
        this.makeSureType(true)
      }
    },
    isVisiableClicked(n){
      // 规格选择提示拼接
      let types = n || 0
      let tips = []
      this.data.productTypeList.forEach((item,index)=>{
        tips.push(item.name)
      })
      tips = '请选择'+tips.join(',')
      //是否显示模态框
      this.setData({
        tips:tips,
        visiable: !this.data.visiable,
      })
      if (this.data.visiable){
        this.triggerEvent('hiddenTips');
      }
    },
    isSelectAll(){ // 是否选择了所有的规格选项
      let isActive = this.data.isActive
      if (!(this.data.isActive.length == this.properties.productTypeList.length)){
        return false 
      }
      isActive.forEach((item,index)=>{
        if (item.id == undefined || item === undefined ){
          return false 
        }
      })
      return true
    }
  },
  
  ready: function () {
    
  }
})
