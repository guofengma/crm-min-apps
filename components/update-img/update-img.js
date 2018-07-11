let { Tool, RequestFactory } = global;

Component({
  properties: {
    
  },
  data: {
    originalImg:[],
    smallImg:[],
  },
  methods: {
    //添加图片
    uploadImg() {
      let callBack = (fileInfo) => {
        let tempUrl = fileInfo.data.imageUrl;
        let tempThumbUrl = fileInfo.data.imageThumbUrl;
        this.data.originalImg.push(tempUrl);
        this.data.smallImg.push(tempThumbUrl);
        this.setData({
          originalImg: this.data.originalImg,
          smallImg: this.data.smallImg
        })
        this.triggerEvent('uploadImage', { ...this.data})
      };
      Tool.uploadImage(1, callBack)
    },
    //删除图片
    deleteImg(e) {
      let index = e.currentTarget.dataset.index;
      this.data.originalImg.splice(index, 1);
      this.data.smallImg.splice(index, 1);
      this.setData({
        originalImg: this.data.originalImg,
        smallImg: this.data.smallImg
      })
      this.triggerEvent('uploadImage', {...this.data})
    },
  },
  ready: function () {
    
  }
})
