let { Tool, RequestFactory, Storage } = global

Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyWord:'',
    history: [],
    hotWords:[],
    province:'',
    provinceCode:-1
  },
  onLoad: function (options) {
    if (options.door == 0){
      let history = Storage.getHistorySearch()
      if (history) {
        this.setData({
          history: history
        })
      }
      this.requestGetHotWordsListActive()
      this.getLocation()
    } else {
      this.setData({
        history: Storage.getSearchOrderHistory(),
        door: options.door
      })
    }
  },
  onShow: function () {

  },
  getLocation(){
    let callBack = (res) =>{
      if(res){
        this.setData({
          province: res.originalData.result.addressComponent.province
        })
        this.getProvinceList(this.data.province)
      }
    }
    Tool.queryLocation(callBack)
  },
  requestGetHotWordsListActive(){
    let r = RequestFactory.getHotWordsListActive();
    r.finishBlock = (req) => {
      this.setData({
        hotWords: req.responseObject.data
      })
    }
    r.addToQueue();
  },
  getHotkeyword(e){
    this.setData({
      keyWord: e.currentTarget.dataset.keyword
    })
    this.getRequest()
  },
  getKeyword(e){
    this.setData({
      keyWord:e.detail.value
    })
  },
  deleteKeyword(){
    if(this.data.door==1){
      Storage.setSearchOrderHistory(null)
    } else {
      Storage.clearHistorySearch()
    }
    this.setData({
      history:[]
    })
  },
  searchKeyword(){
    if (!Tool.isEmptyStr(this.data.keyWord)) {
      let str = this.data.keyWord.length > 5 ? this.data.keyWord.slice(0, 5) + "..." : this.data.keyWord
      let keywords = this.data.history
      if (keywords.length > 0) {
        keywords.length == 10 ? keywords.splice(9, 1) : keywords
        keywords.unshift(str)
        if (this.data.door == 1) {
          Storage.setSearchOrderHistory(keywords)
        } else {
          Storage.setHistorySearch(keywords)
        }
        
      } else {
        if (this.data.door == 1) {
          Storage.setSearchOrderHistory([str])
        } else {
          Storage.setHistorySearch([str])
        }
      }
    }
    this.getRequest()
  },
  requestKeyword(){
    Tool.redirectTo('/pages/search/search-result/search-result?keyword=' +this.data.keyWord+'&code=' + this.data.provinceCode)
  },
  requestOrder() {
    Tool.redirectTo('/pages/search/search-order/search-order?condition=' + this.data.keyWord)
  },
  getRequest(){
    if (this.data.door == 1) {
      this.requestOrder()
    } else {
      this.requestKeyword()
    }
  },
  getProvinceList() {
    let r = RequestFactory.getProvinceList();
    r.finishBlock = (req) => {
      let data = req.responseObject.data
      let showProvince = ''
      for (let i = 0; i < data.length; i++) {
        if (data[i].name == this.data.province) {
          showProvince = data[i]
          break
        }
      }
      this.setData({
        provinceCode: showProvince.zipcode || -1
      })
    }
    r.addToQueue();
  },
})