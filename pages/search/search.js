let { Tool, RequestFactory, Storage } = global

Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyWord:'',
    history: [],
    hotWords:[]
  },
  onLoad: function (options) {
    let history = Storage.getHistorySearch()
    if(history){
      this.setData({
        history: history
      })
    }
    this.requestGetHotWordsListActive()
  },
  onShow: function () {

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
    this.requestKeyword()
  },
  getKeyword(e){
    this.setData({
      keyWord:e.detail.value
    })
  },
  deleteKeyword(){
    Storage.clearHistorySearch()
    this.setData({
      history:[]
    })
  },
  searchKeyword(){
    let callBack = (res) =>{
      if(res){
        this.getProvinceList()
      }
      
      this.requestKeyword()
    }
    Tool.queryLocation(callBack)
  },
  setStorageKeyword(){
    if (!Tool.isEmptyStr(this.data.keyWord)) {
      let str = this.data.keyWord.length > 5 ? this.data.keyWord.slice(0, 5) + "..." : this.data.keyWord
      let keywords = this.data.history
      if (keywords.length > 0) {
        keywords.length == 10 ? keywords.splice(9, 1) : keywords
        keywords.unshift(str)
        Storage.setHistorySearch(keywords)
      } else {
        Storage.setHistorySearch([str])
      }
    }
    this.requestKeyword()
  },
  requestKeyword(){
    Tool.redirectTo('/pages/search/search-result/search-result?keyword=' + this.data.keyWord)
  },
  getProvinceList() {
    let r = RequestFactory.getProvinceList();
    r.finishBlock = (req) => {
      let data = req.responseObject.data
      this.setData({
        sheng: data
      })
    }
    r.addToQueue();
  },
})