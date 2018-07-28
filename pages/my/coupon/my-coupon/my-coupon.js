let {Tool, RequestFactory } = global;
Page({
    data: {
        winHeight: "",//窗口高度
        currentTab: 0, //预设当前项的值
        scrollLeft: 0, //tab标题的滚动条位置
        lists: [ // 0是未使用 1：失效 2：已使用
            [
                {
                    couponAmout: 11,
                    full: 500,
                    name: '会员专享',
                    limit: '会员专享卷',
                    time: '2018.06.07-2018.08.07',
                    active: true,
                    left: '立即使用'
                },
                {
                    couponAmout: 11,
                    full: 500,
                    name: '会员专享',
                    limit: '会员专享卷',
                    time: '2018.06.07-2018.08.07',
                    active: false,
                    left: '待激活'
                }
            ],
            [
                {
                    couponAmout: 11,
                    full: 500,
                    name: '会员专享',
                    limit: '会员专享卷',
                    time: '2018.06.07-2018.08.07',
                    active: false,
                    left: '已过期'
                },
                {
                    couponAmout: 11,
                    full: 500,
                    name: '会员专享',
                    limit: '会员专享卷',
                    time: '2018.06.07-2018.08.07',
                    active: false,
                    left: '已过期'
                }
            ],
            [
                {
                    couponAmout: 11,
                    full: 500,
                    name: '会员专享',
                    limit: '会员专享卷',
                    time: '2018.06.07-2018.08.07',
                    active: false,
                    left: '已使用'
                },
                {
                    couponAmout: 11,
                    full: 500,
                    name: '会员专享',
                    limit: '会员专享卷',
                    time: '2018.06.07-2018.08.07',
                    active: false,
                    left: '已使用'
                }
            ]
        ]
    },
    // 滚动切换标签样式
    switchTab: function (e) {
        this.setData({
            currentTab: e.detail.current
        });
        this.checkCor();
    },

    //未使用
    getDiscountCouponNoUse() {
        let params = {};
        let r = RequestFactory.getDiscountCouponNoUse(params);
        r.finishBlock = (req) => {
            this.data.lists[0] = [];
            for (let i in req.responseObject.data) {
                let item = req.responseObject.data[i];
                item.outTime = Tool.formatTime(item.outTime);
                if (item.status == 0) {
                    item.left = ''
                } else {
                    item.left = '已过期'
                }
                this.data.lists[0].push(item)
            }
            this.setData({
                lists: this.data.lists
            })
        };
        Tool.showErrMsg(r);
        r.addToQueue();
    },
    //已经优惠劵列表
    getDiscountCouponUserd() {
        let params = {};
        let r = RequestFactory.getDiscountCouponUserd(params);
        r.finishBlock = (req) => {
            this.data.lists[2] = [];
            for (let i in req.responseObject.data) {
                let item = req.responseObject.data[i];
                item.outTime = Tool.formatTime(item.outTime);
                item.left = '已使用   ';
                this.data.lists[2].push(item)
            }
            this.setData({
                lists: this.data.lists
            })
        };
        Tool.showErrMsg(r);
        r.addToQueue();
    },
    //失效优惠劵列表
    getDiscountCouponLosed() {
        let params = {};
        let r = RequestFactory.getDiscountCouponLosed(params);
        r.finishBlock = (req) => {
            this.data.lists[1] = [];
            for (let i in req.responseObject.data) {
                let item = req.responseObject.data[i];
                item.outTime = Tool.formatTime(item.outTime);
                if (item.status == 0) {
                    item.left = ''
                } else {
                    item.left = '已过期'
                }
                this.data.lists[1].push(item)
            }
            this.setData({
                lists: this.data.lists
            })
        };
        Tool.showErrMsg(r);
        r.addToQueue();
    },

    // 点击标题切换当前页时改变样式
    swichNav: function (e) {
        var cur = e.target.dataset.current;
        if (this.data.currentTaB == cur) {
            return false;
        }
        else {
            this.setData({
                currentTab: cur
            })
        }
    },
    //优惠券详情
    toDetail(){
      let id=e.currentTarget.dataset.id;
      Tool.navigateTo('/coupon-detail/coupon-detail?id='+id)
    },
    //判断当前滚动超过一屏时，设置tab标题滚动条。
    checkCor: function () {
        if (this.data.currentTab > 3) {
            this.setData({
                scrollLeft: 300
            })
        } else {
            this.setData({
                scrollLeft: 0
            })
        }
    },
    onLoad: function () {
        let that = this;
        //  高度自适应
        wx.getSystemInfo({
            success: function (res) {
                let clientHeight = res.windowHeight,
                    clientWidth = res.windowWidth,
                    rpxR = 750 / clientWidth;
                let calc = clientHeight * rpxR;
                that.setData({
                    winHeight: calc
                });
            }
        });
        this.getDiscountCouponNoUse();
        this.getDiscountCouponUserd();
        this.getDiscountCouponLosed();
    },
})