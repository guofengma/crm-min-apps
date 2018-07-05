let { Tool, RequestFactory } = global;

Component({
    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {
        addressList:[]

    },

    /**
     * 组件的方法列表
     */
    methods: {
       //获取地址列表
        getAddressList(){
            let r = global.RequestFactory.queryUserAddressList();
            r.finishBlock = (req) => {
                console.log(req)
                // let data = req.responseObject.data;
                // this.setData({
                //     addressList: data
                // })
            };
            r.addToQueue();
        }
    },
    ready: function () {
        console.log(111)
        this.getAddressList()
    }
})
