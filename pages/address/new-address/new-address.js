let {Tool, RequestFactory, Storage} = global

Page({
    data: {
        region: [],
        isDefault: false, //是否设为默认地址
        isAddress: false, //是否有地址
    },
    onLoad: function (options) {

    },
    onShow: function () {

    },
    pickerClicked(e) {
        this.setData({
            region: e.detail.result
        })
    },
    //设为默认地址
    setDefault() {
        this.setData({
            isDefault: !this.data.isDefault
        })
    },
    formSubmit(e) {
        let params = e.detail.value;
        if (this.data.region[0]) {
            params.provinceCode = this.data.region[0].zipcode;
        }
        if (this.data.region[1]) {
            params.cityCode = this.data.region[1].zipcode;
        }
        if (this.data.region[2]) {
            params.areaCode = this.data.region[2].zipcode;
        }
        // 获取用户ID
        // params.id = Storage.memberId();
        console.log(params);
        if (!Tool.checkName(params.receiver)) {
            Tool.showAlert("请输入正确的中文姓名");
            return
        }
        if (!Tool.checkPhone(params.recevicePhone)) {
            Tool.showAlert("请输入正确的电话号码");
            return
        }
        if (this.data.region.length == 0) {
            Tool.showAlert("请选择你所在的省市区");
            return
        }
        if (Tool.isEmptyStr(params.address)) {
            Tool.showAlert("请输入详细地址");
            return
        }
        this.requestAddUserAddress(params)
    },
    requestAddUserAddress(params) {
        let r = global.RequestFactory.addUserAddress(params);
        r.finishBlock = (req) => {
            //跳转到地址列表页面
            wx.showToast({
                title: '添加成功',
                icon: 'success',
                duration: 2000
            });
            wx.redirectTo({
                url:'../choose-address/choose-address'
            })
        };
        r.addToQueue();
    },

})