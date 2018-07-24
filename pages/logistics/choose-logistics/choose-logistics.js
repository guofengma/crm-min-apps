let { Tool, RequestFactory, Storage, Event } = global

Page({
  data: {
  
  },
  onLoad: function (options) {
  
  },
  logLineClicked(e){
    let datas = {
      id: e.currentTarget.dataset.code,
      name: e.currentTarget.dataset.name
    }
    Storage.setExpressCom(datas)
    Event.emit('updateCompany')
    Tool.navigationPop()
  },
})
