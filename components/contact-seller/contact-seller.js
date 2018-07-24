// components/contact-seller/  contact-seller.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    phone:String
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    makePhoneCall () {
      wx.makePhoneCall({
        phoneNumber: this.properties.phone,
        success: ()=>{
          console.log("成功拨打电话")
        }
      })
    }
  }
})
