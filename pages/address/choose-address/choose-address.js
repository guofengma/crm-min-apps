let {Tool, RequestFactory} = global;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        active: true,
        addressType: 1,
        addressList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            addressType: options.type
        });
        this.getAddressList()
    },
    onShow: function () {

    },
    newAddress() {
        let page = '';
        let addressType = this.data.addressType;
        if (addressType == 1) {
            if (this.data.addressList.length > 0) {
                page = '/pages/address/select-express-address/select-express-address'
            } else {
                page = '/pages/address/new-address/new-address'
            }
        } else {
            page = '/pages/address/select-selfLifting-address/select-selfLifting-address'
        }
        Tool.navigateTo(page)
    },
    //获取地址列表
    getAddressList() {
        let params={};
        let r = global.RequestFactory.queryUserAddressList(params);
        r.finishBlock = (req) => {
            let data = req.responseObject.data;
            this.setData({
                addressList: data
            })
            console.log(this.data.addressList)
        };
        r.addToQueue();
    }
})