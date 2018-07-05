let {Tool, RequestFactory, Event, Storage} = global;
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
      count:0,
      active:false,
      chooseType:false,
      mask:false,
      index:0,
      type:'请选择问题类型',
      success:false
    },
    //选择问题类型弹窗
    questionType(){
        this.setData({
            mask:true
        })
    },
    //选择问题类型
    chooseType(e){
       let index=e.currentTarget.dataset.index;
       let content=e.currentTarget.dataset.content;
       this.setData({
           index:index,
           mask:false,
           type:content
       });
        this.active();
    },
    //计数
    detailRemark(e) {
        let length=e.detail.value.length;
        this.setData({
            count:length
        });
        this.active();
    },
    //提交成功
    sure(){
        this.setData({
            success:false
        })
    },
    active(){
        if(this.data.index!=0&&this.data.count!=0){
            this.setData({
                active:true
            })
        }else{
            this.setData({
                active:false
            })
        }
    },
    onLoad: function (options) {
    },
    onUnload: function () {
    }
})