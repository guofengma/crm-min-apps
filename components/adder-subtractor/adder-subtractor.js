Component({
  properties: {
    count: Number,
    countSize: Number,
  },
  data: {
    innerCount:0
  },
  methods: {
    subClicked: function (e) {
      // 减
      let count = this.data.innerCount - 1;
      if (count < 1 || count == undefined) {
        count = 1;
      }
      this.setData({
        innerCount: count,
      })
      this.trigger(e);
    },
    inputOnChange: function (e) {
      // 手动填写数字
      this.setData({
        innerCount: this.data.innerCount + 1
      })
      this.trigger(e);
    },
    addClicked: function (e) {
      // 加
      this.setData({
        innerCount: this.data.innerCount + 1
      })
      this.trigger(e);
    },
    trigger(e){
      this.triggerEvent('countChange', { ...this.data, e });
    }
  },
  ready: function () {
    this.setData({
      innerCount: this.data.count
    })
  }
})
