let { Tool, RequestFactory } = global
Component({
  properties: {
    productTypeList:Array,
    priceList: Array,
    productInfo:Object,
    imgUrl:String,
    types:Number,
    showImgs:Boolean
  },
  data: {
    visiable:false,
    innerCount: 1, //数量
    isSelect:false,// 是否选择了商品类型
    productType: '',  // 已选择的类型
    isActive:[{index:'',val:''}],
    selectPrdList:'', //已选的类型的商品价格等信息
    tips:'',// 提示语
    typeClicked:0, // 0 规格栏点击 1 加入购物车点击 2 立即购买点击
    stockArr:[]
  },
  methods: {
    makeSureType(show){
      // 点击确定 
      if (this.data.isActive.length == this.properties.productTypeList.length){
        if (this.data.selectPrdList.stock==0){
          Tool.showAlert('库存不足,请选择其他产品')
          return
        } 
        let isActive = this.data.isActive
        let productType = []
        for (let i = 0; i < isActive.length;i++){
          if (isActive[i]){
            productType.push(isActive[i].val)
          }
        }
        // 已选择的类型
        let productType2 = '已选："' + productType.join('""') + '"'

        // 拼接已选的类型 匹配库存和价格
        let seletType = productType.join('-')
        let index = this.showCurrentInfo(seletType)
        this.setData({
          productType: productType2
        })
        if (show !== true){
          if (this.data.selectPrdList.stock < this.data.innerCount) {
            Tool.showAlert('当前产品最多只能购买' + this.data.selectPrdList.stock + '件哦~')
            return
          }
          this.triggerEvent('subClicked', { ...index, typeClicked: this.data.typeClicked, productType: productType2 });
          this.isVisiableClicked()
        }
      }
    },
    showCurrentInfo(types){
      // 现在当前选择的价格
      let list = this.data.priceList
      for(let i = 0; i<list.length;i++){
        if(list[i].spec == types){
          this.setData({
            selectPrdList: list[i]
          })
          return { index: i, id: list[i].id, typeName: list[i].spec}
        }
      }
    },
    typeListClicked(e){
      // 选择的类型 使其 active
      let key = e.currentTarget.dataset.type
      let val = e.currentTarget.dataset.index
      let typeVal = e.currentTarget.dataset.typename
      let id = e.currentTarget.dataset.id
      let obj = this.data.isActive
      obj[key]={}
      obj[key].index = val
      obj[key].val = typeVal
      obj[key].id = id
      this.setData({
        isActive: obj
      })
      let spec_id = []
      for(let i=0;i<obj.length;i++){
        if (obj[i]!== undefined){
          spec_id.push(obj[i].id)
        }
      }
      let params = spec_id.join(',')
      this.findProductStockBySpec(params)
      // 如果类型选择完毕 则马上显示对应的价格和库存
      if (this.data.isActive.length == this.properties.productTypeList.length) {
        this.makeSureType(true)
      }
    },
    isVisiableClicked(n){
      // 规格选择提示拼接
      let types = n || 0
      let tips = []
      for (let i = 0; i < this.data.productTypeList.length;i++){
        tips.push(this.data.productTypeList[i].spec)
      }
      tips = tips.join(',')
      //是否显示模态框
      this.setData({
        tips:tips,
        visiable: !this.data.visiable,
        typeClicked: types
      })
    },
    counterInputOnChange(e) {
      //监督数量选择的改变
      let count = e.detail.innerCount;
      this.setData({
        innerCount: count,
      })
      this.triggerEvent('counterInputOnChange', this.data.innerCount);
    },
    findProductStockBySpec(id){
      let params = {
        productId: this.properties.productInfo.id,
        specId:id
      }
      let stockArr = this.data.stockArr
      let r = r = RequestFactory.findProductStockBySpec(params);
      r.finishBlock = (req) => {
        let datas = req.responseObject.data
        datas.forEach((item)=>{
          let idArr = item.spec_ids.split(',')
          for(let i=0;i<idArr.length;i++){
            for (let j = 0; j < stockArr.length;j++){
              
            }
          }
        })
      };
      Tool.showErrMsg(r)
      r.addToQueue();
    }
  }
})
