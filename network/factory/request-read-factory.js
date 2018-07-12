/**
 * Created by coin on 1/13/17.
 */

import Request from '../base-requests/request'
import Operation from '../operation'

//读取请求具体封装
export default class RequestFactory {
  // 统一的请求 
  static request(url, params = {},name,hasCookie){

    let sysInfo = global.Storage.sysInfo()

    // 是否需要携带cookie
    
    if (hasCookie) params.hasCookie = hasCookie

    //请求的接口

    params.url = url

    // 手机型号
    params.device = sysInfo.model

    // 微信版本
    params.wechatVersion = sysInfo.version

    // 系统版本
    params.systemVersion = sysInfo.system

    let req = new Request(params);

    req.name = name;//用于日志输出

    return req;
  }
  
  /********************登陆*************************/

  // 获取openid verifyWechat

  static verifyWechat(params) {
    let url = Operation.sharedInstance().verifyWechat;
    return this.request(url, params, '获取openid和是否注册');
  }
  
  /*微信登陆*/
  static wechatLogin(params){
    let url = Operation.sharedInstance().wechatLogin;
    return this.request(url, params, '用户微信登陆');
  }

  // 账号密码手动登录
  static passwordLogin(params){
    let url = Operation.sharedInstance().passwordLogin
    return this.request(url, params, '用户账号密码登录');
  }
  

  /********************注册********************/

  //--判断手机号是否可用
  static findMemberByPhone(params) {
    let url = Operation.sharedInstance().findMemberByPhone;
    return this.request(url, params, '判断手机号是否已经注册');
  }

  // 注册用户
  static signMember(params) {
    let url = Operation.sharedInstance().signMember;
    return this.request(url, params, '注册', 1);
  }

  // 获取注册验证码 sendRegistrationCode
  static sendRegistrationCode(phone) {
    let url = Operation.sharedInstance().sendRegistrationCode;
    let bodyParameters = {
      "url": url,
      "port":'8100',
      "phone": phone
    };
    let req = new Request(bodyParameters);
    req.name = '获取注册短信';
    return req;
  }
  
  // 获取邀请者ID queryInviterList
  static queryInviterList(params) {
    let url = Operation.sharedInstance().queryInviterList;
    return this.request(url, params, '获取邀请者列表');
  }
  
  // 实名制 
  static signMemberInfo(params) {
    let url = Operation.sharedInstance().signMemberInfo;
    return this.request(url, params, '用户实名制');
  }

  /**************忘记密码********************/

  // 忘记密码
  static resetPassword(params) {
    let url = Operation.sharedInstance().resetPassword;
    return this.request(url, params, '重置密码');
  }

  // 重置密码短信验证
  static sendUserUpdateCode(params) {
    params.port = '8100'
    let url = Operation.sharedInstance().sendUserUpdateCode;
    return this.request(url, params, '重置密码短信验证');
  }
  
  /********************获取省市区********************/

  // 获取省
  static getProvinceList() {
    let url = Operation.sharedInstance().getProvinceList;
    return this.request(url, { port: '8101' }, '获取省份');
  }

  // 获取市
  static getCityList(params) {
    params.port = '8101'
    let url = Operation.sharedInstance().getCityList;
    return this.request(url, params, '获取市');
  }

  // 获取区
  static getAreaList(params) {
    params.port = '8101'
    let url = Operation.sharedInstance().getAreaList;
    return this.request(url, params, '获取区');
  }

  // 获取商品列表 queryProductListAPP
  
  /**************产品********************/

  
  static queryProductListAPP(params) {
    // 1代表升序 2代表降序
    let url = Operation.sharedInstance().queryProductListAPP;
    console.log(url)
    return this.request(url, params, '获取商品列表', true);
  }

  // 详情页 
  static findProductByIdApp(params) {
  
    let url = Operation.sharedInstance().findProductByIdApp;
    return this.request(url, params, '获取商品详情页', true);
  }

  static findProductByProdCodeString(params) {
    let url = Operation.sharedInstance().findProductByProdCodeString;
    return this.request(url, params, '根据code获取商品详情页', true);
  }
  
  static findProductStockBySpec(params) {
    let url = Operation.sharedInstance().findProductStockBySpec;
    return this.request(url, params, '详情页产品规格选择', true);
  }

  //获取热搜词

  static getHotWordsListActive() {
    let url = Operation.sharedInstance().getHotWordsListActive;
    return this.request(url, {}, '获取热搜词', true);
  }
  // 关键字搜索产品

  static searchProduct(params) {
    let url = Operation.sharedInstance().searchProduct;
    return this.request(url, params, '关键字搜索', true);
  }


  /**************购物车********************/

  static addToShoppingCart(params) {
    let url = Operation.sharedInstance().addToShoppingCart;
    return this.request(url, params, '新增购物车', true);
  }

  static updateShoppingCart(params) {
    let url = Operation.sharedInstance().updateShoppingCart;
    return this.request(url, params, '更新购物车数量', true);
  }

  static shoppingCartFormCookieToSession(params) {
    let url = Operation.sharedInstance().shoppingCartFormCookieToSession;
    return this.request(url, params, '同步本地购物车到服务器', true);
  }

  static getShoppingCartList(params) {
    let url = Operation.sharedInstance().getShoppingCartList;
    return this.request(url, params, '获取购物车', true);
  }
  
  static deleteFromShoppingCart(params) {
    let url = Operation.sharedInstance().deleteFromShoppingCart;
    return this.request(url, params, '删除购物车', true);
  }

  static shoppingCartLimit(params) {
    let url = Operation.sharedInstance().shoppingCartLimit;
    return this.request(url, params, '最大数量同步购物车', true);
  }

  /**************地址管理********************/

  static addUserAddress(params) {
      let url = Operation.sharedInstance().addUserAddress;
      return this.request(url, params, '添加地址', true);
  }

  static queryUserAddressList(params) {
      let url = Operation.sharedInstance().queryUserAddressList;
      let req =  this.request(url, params, '获取地址列表', true);
      req.preprocessCallback = (req, firstData) => {
        let data = req.responseObject.data
        data.forEach((item) => {
          item.addressInfo = item.province + item.city + item.area + item.address
          item.hasData = true
        })
      }
      return req 
  }
  
  
  static updateUserAddress(params) {
    let url = Operation.sharedInstance().updateUserAddress;
    return this.request(url, params, '更新地址', true);
  }

  static setDefaultAddress(params) {
    let url = Operation.sharedInstance().setDefaultAddress;
    return this.request(url, params, '设置默认地址', true);
  }

  static deleteUserAddress(params) {
    let url = Operation.sharedInstance().deleteUserAddress;
    return this.request(url, params, '删除地址', true);
  }
   
  static queryStoreHouseList(params) {
    let url = Operation.sharedInstance().queryStoreHouseList;
    let req = this.request(url, params, '获取自提地址列表', true);
    req.preprocessCallback = (req, firstData) => {
      let data = req.responseObject.data
      data.forEach((item,index) => {
        item.addressInfo = item.province + item.city + item.area + item.address
        item.hasData = true
        if(index == 0){
          item.defaultStatus =1
        }
      })
    }
    return req 
  }

  /**************我的账户********************/

  static queryDetailBalanceListAPP(params) {
      let url = Operation.sharedInstance().queryDetailBalanceListAPP;
      return this.request(url, params, '现金账户', true);
  }

  static queryDetailTokenCoinListAPP(params) {
      let url = Operation.sharedInstance().queryDetailTokenCoinListAPP;
      return this.request(url, params, '代币账户', true);
  }

  static queryDetailUserScorePageListAPP(params) {
      let url = Operation.sharedInstance().queryDetailUserScorePageListAPP;
      return this.request(url, params, '积分账户', true);
  }
  
  static findDealerAccountByIdAPP(params) {
      let url = Operation.sharedInstance().findDealerAccountByIdAPP;
      return this.request(url, params, '经销商账户', true);
  }

  /**************我的订单********************/

  static queryCompletedOrderPageList(params) {
      params.port = '8103';
      let url = Operation.sharedInstance().queryCompletedOrderPageList;
      return this.request(url, params, '已完成订单', true);
  }
  static queryAllOrderPageList(params) {
      params.port = '8103';
      let url = Operation.sharedInstance().queryAllOrderPageList;
      return this.request(url, params, '全部订单', true);
  }
  static queryUnPaidOrderPageList(params) {
      params.port = '8103';
      let url = Operation.sharedInstance().queryUnPaidOrderPageList;
      return this.request(url, params, '待支付订单', true);
  }
  static queryUnSendOutOrderPageList(params) {
      params.port = '8103';
      let url = Operation.sharedInstance().queryUnSendOutOrderPageList;
      return this.request(url, params, '待发货订单', true);
  }
  static queryWaitReceivingOrderPageList(params) {
      params.port = '8103';
      let url = Operation.sharedInstance().queryWaitReceivingOrderPageList;
      return this.request(url, params, '待收货订单', true);
  }
  static getOrderDetail(params) {
      params.port = '8103';
      let url = Operation.sharedInstance().getOrderDetail;
      return this.request(url, params, '订单详情', true);
  }
  static confirmReceipt(params) {
      params.port = '8103';
      let url = Operation.sharedInstance().confirmReceipt;
      return this.request(url, params, '确认收货', true);
  }
  static deleteOrder(params) {
      params.port = '8103';
      let url = Operation.sharedInstance().deleteOrder;
      return this.request(url, params, '删除订单', true);
  }
  static deleteClosedOrder(params) {
      params.port = '8103';
      let url = Operation.sharedInstance().deleteClosedOrder;
      return this.request(url, params, '删除订单', true);
  }
  static cancelOrder(params) {
      params.port = '8103';
      let url = Operation.sharedInstance().cancelOrder;
      return this.request(url, params, '取消订单', true);
  }

  /*******************订单结算******************** */

  static makeSureOrder(params) {
    params.port = '8103'
    let url = Operation.sharedInstance().makeSureOrder;
    return this.request(url, params, '购物车提交订单', true);
  }

  static submitOrder(params) {
    params.port = '8103'
    let url = Operation.sharedInstance().submitOrder;
    return this.request(url, params, '订单结算', true);
  }

  static calcFreight(params) {
    params.port = '8103'
    let url = Operation.sharedInstance().calcFreight;
    return this.request(url, params, '订单修改地址 邮费计算', true);
  }

  static repay(params) {
    params.port = '8103'
    let url = Operation.sharedInstance().repay;
    return this.request(url, params, '预支付', true);
  }

  static paySuccess(params) {
    params.port = '8103'
    let url = Operation.sharedInstance().paySuccess;
    return this.request(url, params, '第三方支付回调接口', true);
  }
  
  static continueToPay(params) {
    params.port = '8103'
    let url = Operation.sharedInstance().continueToPay;
    return this.request(url, params, '继续去支付', true);
  }

  static continuePay(params) {
    params.port = '8103'
    let url = Operation.sharedInstance().continuePay;
    return this.request(url, params, '继续支付', true);
  }

  static againToPrePay(params) {
    params.port = '8103'
    let url = Operation.sharedInstance().againToPrePay;
    return this.request(url, params, '继续去预支付', true);
  }

  
  /*******************  订单 售后******************** */

  static orderRefund(params) {
    params.port = '8103'
    let url = Operation.sharedInstance().orderRefund;
    return this.request(url, params, '申请仅退款', true);
  }

  static applyExchangeProduct(params) {
    params.port = '8103'
    let url = Operation.sharedInstance().applyExchangeProduct;
    return this.request(url, params, '申请换货', true);
  }

  static applyReturnGoods(params) {
    params.port = '8103'
    let url = Operation.sharedInstance().applyReturnGoods;
    return this.request(url, params, '申请退货', true);
  }

  static findReturnProductById(params) {
    params.port = '8103'
    let url = Operation.sharedInstance().findReturnProductById;
    let req = this.request(url, params, '查看退款退货换货情况', true);
    req.preprocessCallback = (req, firstData) => {
      let data = req.responseObject.data
      let returnProduct = data.returnProduct
      returnProduct.applyTime = global.Tool.formatTime(returnProduct.apply_time)
      returnProduct.imgUrl = returnProduct.spec_img
      returnProduct.productName = returnProduct.product_name
      if (data.returnAmountsRecord){
        returnProduct.showAmount = data.returnAmountsRecord.showAmount = returnProduct.price * returnProduct.num
        if (data.returnAmountsRecord.refundTime)
        data.returnAmountsRecord.showRefundTime = global.Tool.formatTime(data.returnAmountsRecord.refundTime)
      }
      data.returnAddress.addressInfo = data.returnAddress.address
      data.receive.addressInfo = data.receive.address
    }
    return req 
  }

  static fillInExpressInfoById(params) {
    params.port = '8103'
    let url = Operation.sharedInstance().fillInExpressInfoById;
    return this.request(url, params, '退货换货填写物流信息', true);
  }

  
  /*******************我的---设置******************** */

  static exitLogin(params) {
      let url = Operation.sharedInstance().exitLogin;
      return this.request(url, params, '退出登录', true);
  }
  
  /*******************我的---通讯录******************** */

  static queryDealerAddressBook(params) {
      let url = Operation.sharedInstance().queryDealerAddressBook;
      return this.request(url, params, '通讯录', true);
  }
  static findDealerAddressBookDetails(params) {
      let url = Operation.sharedInstance().findDealerAddressBookDetails;
      return this.request(url, params, '通讯录详情', true);
  }


  // 上传图片的地址 
  static aliyunOSSUploadImage(){
    let params = {
      port:8100
    }
    let baseUrl = new Request(params).getBaseUrl(params)
    let url = Operation.sharedInstance().aliyunOSSUploadImage;
    return baseUrl+url 
  }


  static updateDealerHeadImg(params) {
    let url = Operation.sharedInstance().updateDealerHeadImg;
    return this.request(url, params, '修改用户头像', true);
  }

  static updateDealerNickname(params) {
    let url = Operation.sharedInstance().updateDealerNickname;
    return this.request(url, params, '修改用户昵称', true);
  }

  static updateDealerRegion(params) {
    let url = Operation.sharedInstance().updateDealerRegion;
    return this.request(url, params, '修改所在区域', true);
  }

  static updateDealerPassword(params) {
    let url = Operation.sharedInstance().updateDealerPassword;
    return this.request(url, params, '修改密码', true);
  }

  static updateDealerOpenid(params){
    let url = Operation.sharedInstance().updateDealerOpenid;
    return this.request(url, params, '解绑微信号', true);
  }

  static updateDealerPhone(params){
    let url = Operation.sharedInstance().updateDealerPhoneById;
    return this.request(url, params, '验证旧手机验证码是否正确', true);
  }
  
  static sendUserPhoneCode(params){
    params.port = '8100'
    let url = Operation.sharedInstance().sendUserPhoneCode;
    return this.request(url, params, '修改手机账号--发生短信到旧手机验证', true);
  }

  static sendUserNewPhoneCode(params) {
    params.port = '8100'
    let url = Operation.sharedInstance().sendUserNewPhoneCode;
    return this.request(url, params, '修改手机账号--发生短信到新手机验证', true);
  }
  
  static updateDealerNewPhone(params) {
    let url = Operation.sharedInstance().updateDealerNewPhone;
    return this.request(url, params, '修改手机账号', true);
  }
  
  /******************* 收藏 ******************** */

  static queryProductFaviconList(params) {
    let url = Operation.sharedInstance().queryProductFaviconList;
    return this.request(url, params, '收藏列表查询', true);
  }

  static deleteProductFavicon(params) {
    let url = Operation.sharedInstance().deleteProductFavicon;
    return this.request(url, params, '删除收藏', true);
  }
  
  static addProductFavicon(params) {
    let url = Operation.sharedInstance().addProductFavicon;
    return this.request(url, params, '新增收藏', true);
  }
 
  /******************* 首页 ******************** */
  
  static queryAdList(Type) {
    let params = {
      pageType: Type
    }
    let url = Operation.sharedInstance().queryAdList;
    return this.request(url, params, '轮播图查询', true);
  }
  
  static topicList(params) {
    params.port = '8101'
    let url = Operation.sharedInstance().topicList;
    return this.request(url, params, '获取首页专题', true);
  }

  static queryFeaturedList(params) {
    let url = Operation.sharedInstance().queryFeaturedList;
    return this.request(url, params, '获取推荐产品', true);
  }

  /***********************帮助中心********************************/

  static queryHelpQuestionList(id) {
    let params = id ? {typeid:id}:{}
    let url = Operation.sharedInstance().queryHelpQuestionList;
    return this.request(url, params, '问题列表', true);
  }

  static findHelpQuestionById(params) {
    let url = Operation.sharedInstance().findHelpQuestionById;
    return this.request(url, params, '根据ID查询问题详情', true);
  }

  static updateHelpQuestion(params) {
    let url = Operation.sharedInstance().queryHelpQuestionList;
    return this.request(url, params, '解决问题是否有用', true);
  }

  static addFeedback(params) {
    let url = Operation.sharedInstance().addFeedback;
    return this.request(url, params, '添加反馈', true);
  }

}

