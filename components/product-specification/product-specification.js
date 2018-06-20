Component({
  properties: {

  },
  data: {
    visiable:false,
    innerCount: 1,
  },
  methods: {
    typeClicked(){
      this.setData({
        visiable: !this.data.visiable
      })
    },
    counterAddClicked(e) {
      this.setData({
        innerCount: this.data.innerCount + 1
      })
      console.log('counterAddClicked clicked');
    },
    counterSubClicked(e) {
      let count = this.data.innerCount - 1;
      if (count < 1 || count == undefined) {
        count = 1;
      }
      this.setData({
        innerCount: count,
      })
    },
    counterInputOnChange(e) {
      let count = e.detail.e.detail.value;
      if (count == null || count == undefined) {
        count = 1;
      }
      count = parseInt(count);
      if (count <= 0) {
        count = 1;
      }
      console.log("counterInputOnChange:" + count);
      this.setData({
        innerCount: count,
      })
    },
  }
})
