let { Tool, RequestFactory, Event} = global

Page({
  data: {
    addressType:1,
    addressList:[]
  },
  onLoad: function (options) {
    this.queryUserAddressList()
    Event.on('updateAdressList', this.queryUserAddressList, this)
  },
  onShow: function () {

  },
  queryUserAddressList(){
    let r = RequestFactory.queryUserAddressList();
    r.finishBlock = (req) => {
      if (req.responseObject.data.length>0){
        this.setData({
          addressList: req.responseObject.data
        })
      }
    };
    r.addToQueue();
  },
  setDefault(e){
    let id = this.getAddressId(e).id
    let r = RequestFactory.setDefaultAddress({id:id});
    r.finishBlock = (req) => {
      this.queryUserAddressList()
    };
    r.addToQueue();
  },
  getAddressId(e){
    let index = e.currentTarget.dataset.index
    let id = this.data.addressList[index].id
    return {index,id}
  },
  deleteAddress(e){
    let item = this.getAddressId(e)
    let r = RequestFactory.deleteUserAddress({ id: item.id });
    r.finishBlock = (req) => {
      let list = this.data.addressList
      list.splice(item.index,1)
      this.setData({
        addressList:list
      })
    };
    r.addToQueue();
  },
  editAddress(e){
    let index = this.getAddressId(e).index
    let list = this.data.addressList[index]
    this.newAddress(list,1)
  },
  newAddress(list,types){
    let page = '/pages/address/new-address/new-address'
    if(types == 1){
      page = page+'?address=' + JSON.stringify(list)
    }
    Tool.navigateTo(page)
  },
  onUnload: function () {
    Event.off('updateAdressList', this.queryUserAddressList);
  },
})