let {Tool, RequestFactory, Event, Storage} = global;
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        count: 0,
        active: false,
        chooseType: false,
        mask: false,
        index: 0,
        type: '请选择问题类型',
        success: false,
        originalImg: [],
        smallImg: [],
        content:''
    },
    //选择问题类型弹窗
    questionType() {
        this.setData({
            mask: true
        })
    },
    //选择问题类型
    chooseType(e) {
        let index = e.currentTarget.dataset.index;
        let content = e.currentTarget.dataset.content;
        this.setData({
            index: index,
            mask: false,
            type: content
        });
        this.active();
    },
    //计数
    detailRemark(e) {
        let length = e.detail.value.length;
        this.setData({
            count: length,
            content:e.detail.value
        });
        this.active();
    },
    //添加图片
    uploadImg() {
        let callBack = (fileInfo) => {
            let tempUrl = fileInfo.data.imageUrl;
            let tempThumbUrl = fileInfo.data.imageThumbUrl;
            this.data.originalImg.push(tempUrl);
            this.data.smallImg.push(tempThumbUrl);
            this.setData({
                originalImg:this.data.originalImg,
                smallImg:this.data.smallImg
            })
        };
        Tool.uploadImage(1, callBack)
    },
    //删除图片
    deleteImg(e){
        let index=e.currentTarget.dataset.index;
        this.data.originalImg.splice(index,1);
        this.data.smallImg.splice(index,1);
        this.setData({
            originalImg:this.data.originalImg,
            smallImg:this.data.smallImg
        })
    },
    //提交成功
    addFeedback() {
        if (this.data.active) {
            let params = {
                content: this.data.content,
                type: this.data.index,
            };
            if(this.data.originalImg){
                params.originalImg=this.data.originalImg.join(',');
                params.smallImg=this.data.smallImg.join(',')
            }
            let r = RequestFactory.addFeedback(params);
            r.finishBlock = (req) => {
                if(req.responseObject.code==200){
                    this.setData({
                        success:true
                    })
                }
            };
            r.addToQueue();
        }
    },
    //确定
    sure(){
      this.setData({
          success:false
      });
      Tool.navigateTo('../help-customer')
    },
    active() {
        if (this.data.index != 0 && this.data.count != 0) {
            this.setData({
                active: true
            })
        } else {
            this.setData({
                active: false
            })
        }
    },
    onLoad: function (options) {
    },
    onUnload: function () {
    }
})