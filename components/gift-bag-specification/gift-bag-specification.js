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
    isSelect:false,// 是否选择了商品类型
    productType: '',  // 已选择的类型
    isActive:[{index:'',val:''}],
    selectPrdList:{}, //已选的类型的商品价格等信息
    tips:'',// 提示语
    typeClicked:0, // 0 规格栏点击 1 加入购物车点击 2 立即购买点击
  },
  methods: {
    makeSureType(show){
      // 点击确定 
      if (!this.isSelectAll()) return
      let isActive = this.data.isActive
      let productType = []
      isActive.forEach((item, index) => {
        productType.push(item.val)
      })
      // 拼接已选的类型 匹配库存和价格
      let seletType = productType.join('-')
      // 显示价格
      let index = this.showCurrentInfo(seletType)

      // 如果被选择的库存小于用户输入的库存 发生在先选择数量再选择规格的情况下
      if (this.data.selectPrdList.stock < this.data.innerCount) {
        this.setData({
          innerCount: this.data.selectPrdList.stock,
        })
      }
      // 已选择的类型
      let productType2 = '已选："' + productType.join('""') + '"'
      this.setData({
        productType: productType2
      })
      if(show != true){
        this.triggerEvent('subClicked', { ...index, typeClicked: this.data.typeClicked, productType: productType2 });
        this.isVisiableClicked()
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
          return { index: i, id: list[i].id, typeName: list[i].spec, stock: list[i].stock}
        }
      }
    },
    typeListClicked(e){
      // 选择的类型 使其 active

      let key = e.currentTarget.dataset.type
      let index = e.currentTarget.dataset.index
      let val = e.currentTarget.dataset.typename
      let id = e.currentTarget.dataset.id

      // 深复制数组
      let obj = [...this.data.isActive]
      obj[key]={index,val,id}
      let spec_id = []
      console.log(obj)
      // 如果二次点击同一个规格 那么去掉 只点击一次 就加入请求
      // this.data.isActive.forEach((item,index)=>{
      //   if (item.id == obj[key].id){
      //     spec_id[index] = undefined
      //     obj[key] = {}
      //   } else {
      //     for (let i = 0; i < obj.length; i++) {
      //       if (obj[i] !== undefined) {
      //         spec_id[i] = obj[i].id
      //       }
      //     }
      //   }
      // })
      this.setData({
        isActive: obj
      })
      // 数组长度等于规格清单数组长度
      spec_id.length = this.properties.productTypeList.length
      //this.findProductStockBySpec(spec_id, key, index,obj)
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
      if (this.data.visiable){
        this.triggerEvent('hiddenTips');
      }
    },
    findProductStockBySpec(idParams, key, index ,obj){
      let productTypeList = this.properties.productTypeList
      let specId = []
      idParams.forEach((item,index)=>{
        if (item !== undefined) {
          specId.push(item)
        }
      })

      let params = {
        productId: this.properties.productInfo.id,
        specId: specId.join(',')
      }

      let r = r = RequestFactory.findProductStockBySpec(params);
      r.finishBlock = (req) => {
        let datas = req.responseObject.data
        let isSelectAll = this.isSelectAll()
        // 已经选好所以的规格值以后 更换某个规格 但无库存的情况下置灰
        if (datas.length == 0 && isSelectAll) {
          productTypeList[key].types[index] = null
          obj[key].index = null
        }
        // 渲染没有选择的那一列是否有库存
        for (let a = 0; a < idParams.length; a++) {
          if (idParams[a] === undefined) {
            productTypeList[a].types = []
            datas.forEach((item) => {
              let idArr = item.spec_ids.split(',')
              item.idArr = idArr
              productTypeList.forEach((list, index) => {
                for (let i = 0; i < idArr.length; i++) {
                  let index = productTypeList[a].typeId.indexOf(idArr[i])
                  if (index != -1) {
                    productTypeList[a].types[index] = true
                  }
                }
              })
            })
          }
        }     
        
        // 如果返回有数据 或者 无数据的情况下并没有选完所以的规格 刷新数据
        if (datas.length > 0 || (datas.length == 0 && !isSelectAll)) {
          this.setData({
            isActive: obj,
            datas: datas
          })
        }
        // 渲染规格

        this.triggerEvent('productTypeListClicked', { productTypeList });

        // 渲染对应的库存和价格
        this.makeSureType(true)
      };
      Tool.showErrMsg(r)
      r.addToQueue();
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
