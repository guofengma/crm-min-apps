Component({
  properties: {
    productTypeList:Array,
    priceList: Array,
  },
  data: {
    visiable:false,
    innerCount: 1,
    isSelect:false,// 是否选择了商品类型
    productType: '',
    isActive:[{index:'',val:''}],
  },
  methods: {
    makeSureType(e){
      console.log(this.properties.productTypeList)
      if (this.data.isActive.length == this.properties.productTypeList.length){
        console.log(11111)
        let isActive = this.data.isActive
        let productType = []
        for (let i = 0; i < isActive.length;i++){
          productType.push(isActive[i].val)
        }
        console.log(productType)
        this.triggerEvent('subClicked', productType);
        let productType2 = '已选：""' + productType.join('""') + '""'

        let seletType = productType.join('-')
        this.chooseType(seletType)
        this.types 
        this.setData({
          productType: productType2
        })      
        this.typeClicked()
      }
    },
    chooseType(types){
      console.log(types)
      console.log(this.data.priceList)
    },
    typeListClicked(e){
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
      console.log(this.data.isActive)
    },
    typeClicked(){
      this.setData({
        visiable: !this.data.visiable
      })
    },
    counterInputOnChange(e) {
      let count = e.detail.innerCount;
      this.setData({
        innerCount: count,
      })
      this.triggerEvent('counterInputOnChange', this.data.innerCount);
    },
  }
})
