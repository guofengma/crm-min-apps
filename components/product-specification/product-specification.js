Component({
  properties: {
    productTypeList:Array
  },
  data: {
    visiable:false,
    innerCount: 1,
    isSelect:false,// 是否选择了商品类型
    productType: '',
    isActive:[{index:'',val:''}],
    // productTypeList:[
    //   {name:'颜色分类',list:['金色','黄色']},
    //   { name: '颜色分类', list: ['金色', '黄色']}
    // ]
  },
  methods: {
    makeSureType(e){
      console.log(this.properties.productTypeList)
      if (this.data.isActive.length == this.properties.productTypeList.length){
        let isActive = this.data.isActive
        let productType = []
        for (let i = 0; i < isActive.length;i++){
          productType.push(isActive[i].val)
        }
        console.log(productType)
        this.triggerEvent('subClicked', productType);
        productType = '已选：""' + productType.join('""') + '""'
        // this.setData({
        //   productType: productType
        // })
        
        this.typeClicked()
      }
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
    counterAddClicked(e) {
      this.setData({
        innerCount: this.data.innerCount + 1
      })
    },
    counterSubClicked(e) {
      let count = this.data.innerCount - 1;
      if (count < 1 || count == undefined) {
        count = 1;
      }
      this.setData({
        innerCount: count,
      })
    },
    counterInputOnChange(e) {
      let count = e.detail.e.detail.value;
      if (count == null || count == undefined) {
        count = 1;
      }
      count = parseInt(count);
      if (count <= 0) {
        count = 1;
      }
      this.setData({
        innerCount: count,
      })
    },
  }
})
