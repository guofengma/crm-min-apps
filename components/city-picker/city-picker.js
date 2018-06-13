// components/city-picker/city-picker.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    sheng: [111, 222, 333],//获取到的所有的省
    shi: [1, 2, 3],//选择的该省的所有市
    qu: [1, 2, 3],//选择的该市的所有区县
    sheng_index: 0,//picker-view省项选择的value值
    shi_index: 0,//picker-view市项选择的value值
    qu_index: 0,//picker-view区县项选择的value值
    shengshi: null,//取到该数据的所有省市区数据
    jieguo: {},//最后取到的省市区名字
    animationData: {},
    isChoose:false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    dianji: function () { //这里写了一个动画，让其高度变为满屏
      var animation = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease',
      })
      this.animation = animation
      animation.height(100+ '%').step()
      this.setData({
        animationData: animation.export()
      })

    },
    //取消按钮
    quxiao: function () {  //这里也是动画，然其高度变为0
      var animation = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease',
      })

      this.animation = animation
      animation.height(0 + 'rpx').step()
      this.setData({
        animationData: animation.export()
      });
      　　//取消不传值，这里就把jieguo 的值赋值为{}
      this.setData({
        jieguo: {}
      });
      console.log(this.data.jieguo);
    },
    //确认按钮
    queren: function () {
      　　　//一样是动画，级联选择页消失，效果和取消一样
      var animation = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease',
      })
      this.animation = animation
      animation.height(0 + 'rpx').step()
      this.setData({
        animationData: animation.export()
      });
      //打印最后选取的结果
      console.log(this.data.jieguo);
    },
    //滚动选择的时候触发事件
    bindChange: function (e) {
      //这里是获取picker-view内的picker-view-column 当前选择的是第几项
      　const val = e.detail.value
      this.setData({
        sheng_index: val[0],
        shi_index: val[1],
        qu_index: val[2]
      })
      //this.jilian();
      console.log(val);

      console.log(this.data.jieguo);
    },
    //这里是判断省市名称的显示
    jilian: function () {
      var that = this,
        shengshi = that.data.shengshi,
        sheng = [],
        shi = [],
        qu = [],
        qu_index = that.data.qu_index,
        shi_index = that.data.shi_index,
        sheng_index = that.data.sheng_index;
      　　　　//遍历所有的省，将省的名字存到sheng这个数组中
      for (let i = 0; i < shengshi.length; i++) {
        sheng.push(shengshi[i].name)
      }

      if (shengshi[sheng_index].regions) {//这里判断这个省级里面有没有市（如数据中的香港、澳门等就没有写市）
        if (shengshi[sheng_index].regions[shi_index]) {//这里是判断这个选择的省里面，有没有相应的下标为shi_index的市，因为这里的下标是前一次选择后的下标，比如之前选择的一个省有10个市，我刚好滑到了第十个市，现在又重新选择了省，但是这个省最多只有5个市，但是这时候的shi_index为9，而这里的市根本没有那么多，所以会报错
          　　　　　　　　　　//这里如果有这个市，那么把选中的这个省中的所有的市的名字保存到shi这个数组中
          for (let i = 0; i < shengshi[sheng_index].regions.length; i++) {
            shi.push(shengshi[sheng_index].regions[i].name);
          }
          console.log('执行了区级判断');

          if (shengshi[sheng_index].regions[shi_index].regions) {//这里是判断选择的这个市在数据里面有没有区县
            if (shengshi[sheng_index].regions[shi_index].regions[qu_index]) {//这里是判断选择的这个市里有没有下标为qu_index的区县，道理同上面市的选择
              console.log('这里判断有没有进区里');
              　　　　　　　　　　　　//有的话，把选择的这个市里面的所有的区县名字保存到qu这个数组中
              for (let i = 0; i < shengshi[sheng_index].regions[shi_index].regions.length; i++) {
                console.log('这里是写区得');
                qu.push(shengshi[sheng_index].regions[shi_index].regions[i].name);
              }
            } else {
              　　　　　　　　　　//这里和选择市的道理一样
              that.setData({
                qu_index: 0
              });
              for (let i = 0; i < shengshi[sheng_index].regions[shi_index].regions.length; i++) {
                qu.push(shengshi[sheng_index].regions[shi_index].regions[i].name);
              }
            }
          } else {
            　　　　　　　　　　　　//如果这个市里面没有区县，那么把这个市的名字就赋值给qu这个数组
            qu.push(shengshi[sheng_index].regions[shi_index].name);
          }
        } else {
          　　　　　　//如果选择的省里面没有下标为shi_index的市，那么把这个下标的值赋值为0；然后再把选中的该省的所有的市的名字放到shi这个数组中
          that.setData({
            shi_index: 0
          });
          for (let i = 0; i < shengshi[sheng_index].regions.length; i++) {
            shi.push(shengshi[sheng_index].regions[i].name);
          }

        }
      } else {
        　　　　　　//如果该省级没有市，那么就把省的名字作为市和区的名字
        shi.push(shengshi[sheng_index].name);
        qu.push(shengshi[sheng_index].name);
      }

      console.log(sheng);
      console.log(shi);
      console.log(qu);
      //选择成功后把相应的数组赋值给相应的变量
      that.setData({
        sheng: sheng,
        shi: shi,
        qu: qu
      });
      　　　　//有时候网络慢，会出现区县选择出现空白，这里是如果出现空白那么执行一次回调
      if (sheng.length == 0 || shi.length == 0 || qu.length == 0) {
        that.jilian();
        console.log('这里执行了回调');
        // console.log();
      }
      console.log(sheng[that.data.sheng_index]);
      console.log(shi[that.data.shi_index]);
      console.log(qu[that.data.qu_index]);
      　　　　//把选择的省市区都放到jieguo中
      let jieguo = {
        sheng: sheng[that.data.sheng_index],
        shi: shi[that.data.shi_index],
        qu: qu[that.data.qu_index]
      };

      that.setData({
        jieguo: jieguo
      });

    },
  },
  ready: function () {
  //   let r = null;
  //   if (this.data.isProperty) {
  //     r = global.RequestReadFactory.requestPropertyType()
  //   }
  //   else {
  //     r = global.RequestReadFactory.requestAwardType()
  //   }
  //   r.finishBlock = (req) => {
  //     let datas = req.responseObject.Datas;
  //     this.setData({
  //       items: datas,
  //     })
  //   }
  //   r.addToQueue();
   }
})
