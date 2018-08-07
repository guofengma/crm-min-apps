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
        activeIndex:0,
        type: '请选择问题类型',
        success: false,
        originalImg: [],
        smallImg: [],
        content:'',
        bgImgUrl:"https://dnlcrm.oss-cn-beijing.aliyuncs.com/xcx/checked.png",
        typeArr:[
          "请选择问题类型","账户问题", "营销问题", "购买流程","推广机制"
        ]
    },
    //选择问题类型弹窗
    questionType() {
      this.setData({
        mask: !this.data.mask,
      })
    },
    //选择问题类型
    chooseType(e) {
        let index = e.currentTarget.dataset.index;
        this.setData({
          activeIndex: index,
          mask: !this.data.mask,
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
    uploadImage(e) {
      this.setData({
        originalImg: e.detail.originalImg,
        smallImg: e.detail.smallImg,
      })
    },
    //提交成功
    addFeedback() {
      if (this.data.active) {
          let params = {
              content: this.data.content,
              type: this.data.activeIndex,
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
      Tool.navigationPop()
    },
    active() {
      if (this.data.activeIndex !=0  && this.data.count != 0) {
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