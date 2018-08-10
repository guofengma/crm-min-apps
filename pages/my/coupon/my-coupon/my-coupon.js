let { Tool, RequestFactory, Storage,Event} = global;
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
      // // 1 全品类 2 多品类 3 单品类 4 单产品
      // let myType = item.categoryType
      // if (myType==1){
      //   item.showName = '全品类'
      // } else if (myType == 2 || myType == 3 ){
      //   item.showName = item.firstCategoryNames
      // } else if (myType == 4) {
      //   item.showName = item.productNames
      // }
    },
    availableDiscountCouponForProduct(){
      let params = {
        productIds: this.data.productIds
      };

      let r = RequestFactory.availableDiscountCouponForProduct(params);
      r.finishBlock = (req) => {
        this.data.lists[0] = [];
        let currentTime = new Date().getTime() // 获取当前时间
        for (let i in req.responseObject.data) {
          let item = req.responseObject.data[i];
          item.outTime = Tool.formatTime(item.outTime).slice(0, 10);
          if (currentTime > item.startTime) {
            item.left = '';
            item.canUse =1
            item.active = true;
            item.canUseStart = true
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
    //未使用
    getDiscountCouponNoUse() {
        let r = RequestFactory.getDiscountCouponNoUse();
        r.finishBlock = (req) => {
            this.data.lists[0] = [];
            let currentTime = new Date().getTime() // 获取当前时间
            for (let i in req.responseObject.data) {
              let item = req.responseObject.data[i];
              item.outTime = Tool.formatTime(item.outTime).slice(0, 10);
              if (currentTime > item.startTime){
                item.left = '';
                item.active = true;
                item.canUse = 1
                item.canUseStart = true
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
      let id=e.currentTarget.dataset.id
      let btn = e.currentTarget.dataset.btn
      let canUse = e.currentTarget.dataset.canuse
      let index = e.currentTarget.dataset.index
      if (canUse!=1){
        Tool.navigateTo('../coupon-detail/coupon-detail?id=' + id + "&btn=" + btn)
      } else if (canUse==1 && this.data.lists[0][index].canUseStart) {
        Storage.setCoupon(this.data.lists[0][index])
        Event.emit("updateCoupon")
        Tool.navigationPop()
      }
    },
    giveUpUse(){
      Storage.setCoupon({id:""})
      Event.emit("updateCoupon")
      Tool.navigationPop()
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
      onLoad: function (options) {
        let that = this;
        //  高度自适应
        wx.getSystemInfo({
          success: function (res) {
            let clientHeight = res.windowHeight,
                clientWidth = res.windowWidth,
                rpxR = 750 / clientWidth;
            let calc = clientHeight * rpxR;
            let calc0 = clientHeight * rpxR
            if (that.data.currentTab == 0 & options.door == 1 ){
              calc -= 100 * rpxR
            }
            that.setData({
              winHeight: [calc, calc0, calc0],
            });
          }
        });
        this.setData({
          door: options.door || '',
          productIds: options.productIds || '',
        })
        if(this.data.door==1){
          this.availableDiscountCouponForProduct()
        } else {
          this.getDiscountCouponNoUse();
        }
        this.getDiscountCouponUserd();
        this.getDiscountCouponLosed();
    },
})