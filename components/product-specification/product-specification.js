Component({
  properties: {
    productTypeList:Array,
    priceList: Array,
    productInfo:Object
  },
  data: {
    visiable:false,
    innerCount: 1, //数量
    isSelect:false,// 是否选择了商品类型
    productType: '',  // 已选择的类型
    isActive:[{index:'',val:''}],
    selectPrdList:'', //已选的类型的商品价格等信息
    tips:'',// 提示语
  },
  methods: {
    makeSureType(show){
      // 点击确定 
      if (this.data.isActive.length == this.properties.productTypeList.length){
        let isActive = this.data.isActive
        let productType = []
        for (let i = 0; i < isActive.length;i++){
          productType.push(isActive[i].val)
        }
        // 已选择的类型
        let productType2 = '已选：""' + productType.join('""') + '""'

        // 拼接已选的类型 匹配库存和价格
        let seletType = productType.join('-')
        let index = this.showCurrentInfo(seletType)
        this.setData({
          productType: productType2
        })
        if (show !== true){
          this.triggerEvent('subClicked', { index });
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
          return i
        }
      }
    },
    typeListClicked(e){
      // 选择的类型 使其 active
      let key = e.currentTarget.dataset.type
      console.log(key)
      let val = e.currentTarget.dataset.index
      let typeVal = e.currentTarget.dataset.typename
      let obj = this.data.isActive
      obj[key]={}
      obj[key].index = val
      obj[key].val = typeVal
      this.setData({
        isActive: obj
      })
      // 如果类型选择完毕 则马上显示对应的价格和库存
      if (this.data.isActive.length == this.properties.productTypeList.length) {
        this.makeSureType(true)
      }
    },
    isVisiableClicked(){
      // 规格选择提示拼接
      let tips = []
      for (let i = 0; i < this.data.productTypeList.length;i++){
        tips.push(this.data.productTypeList[i].spec)
      }
      tips = tips.join(',')
      console.log(tips)
      //是否显示模态框
      this.setData({
        tips:tips,
        visiable: !this.data.visiable
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
  }
})