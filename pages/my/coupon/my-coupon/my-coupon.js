let {Tool, RequestFactory } = global;
Page({
    data: {
        winHeight: "",//窗口高度
        currentTab: 0, //预设当前项的值
        scrollLeft: 0, //tab标题的滚动条位置
        lists: [ // 0是未使用 1：失效 2：已使用
            [  ],
            [  ],
            [  ]
        ]
    },
    // 滚动切换标签样式
    switchTab: function (e) {
        this.setData({
            currentTab: e.detail.current
        });
        this.checkCor();
    },
    getCouponType(item){
      // 1 全品类 2 多品类 3 单品类 4 单产品
      let myType = item.categoryType
      if (myType==1){
        item.showName = '全品类'
      } else if (myType == 2 || myType == 3 ){
        item.showName = item.firstCategoryNames
      } else if (myType == 4) {
        item.showName = item.productNames
      }
    },
    //未使用
    getDiscountCouponNoUse() {
        let params = {};
        let r = RequestFactory.getDiscountCouponNoUse(params);
        r.finishBlock = (req) => {
            this.data.lists[0] = [];
            let currentTime = new Date().getTime() // 获取当前时间
            for (let i in req.responseObject.data) {
              let item = req.responseObject.data[i];
              item.outTime = Tool.formatTime(item.outTime).slice(0, 10);
              if (currentTime > item.startTime){
                item.left = '';
                item.active = true;
              } else {
                item.left = '待激活';
                item.active = false
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
              item.outTime = Tool.formatTime(item.outTime).slice(0, 10);
                item.left = '已使用';
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
              item.outTime = Tool.formatTime(item.outTime).slice(0, 10);
              item.left = '已过期';
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
    toDetail(e){
      let id=e.currentTarget.dataset.id;
      let btn = e.currentTarget.dataset.btn
      console.log(btn)
      Tool.navigateTo('../coupon-detail/coupon-detail?id=' + id + "&btn=" + btn)
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