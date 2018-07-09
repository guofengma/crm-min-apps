Page({
  data: {
    winHeight: "",//窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    lists:[ // 0是未使用 1：失效 2：已使用
      [
        { couponAmout: 11, full: 500, name: '会员专享', limit: '会员专享卷', time:'2018.06.07-2018.08.07',active:true,left:'立即使用'},
        { couponAmout: 11, full: 500, name: '会员专享', limit: '会员专享卷', time: '2018.06.07-2018.08.07', active: false,left:'待激活' }
      ],
      [
        { couponAmout: 11, full: 500, name: '会员专享', limit: '会员专享卷', time: '2018.06.07-2018.08.07', active: false, left: '已过期' },
        { couponAmout: 11, full: 500, name: '会员专享', limit: '会员专享卷', time: '2018.06.07-2018.08.07', active: false, left: '已过期' }
      ],
      [
        { couponAmout: 11, full: 500, name: '会员专享', limit: '会员专享卷', time: '2018.06.07-2018.08.07', active: false, left: '已使用' },
        { couponAmout: 11, full: 500, name: '会员专享', limit: '会员专享卷', time: '2018.06.07-2018.08.07', active: false, left: '已使用' }
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
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    var cur = e.target.dataset.current;
    if (this.data.currentTaB == cur) { return false; }
    else {
      this.setData({
        currentTab: cur
      })
    }
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
  },
})