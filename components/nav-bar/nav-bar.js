// let { Tool, RequestFactory } = global;

Component({
  properties: {
    
  },
  data: {
    show:false
  },
  methods: {
    changeShow(){
      this.setData({
        show: !this.data.show
      })
      this.triggerEvent('changeShow',this.data.show)
    }
  },
  ready: function () {
    
  }
})
