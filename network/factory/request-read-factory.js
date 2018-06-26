/**
 * Created by coin on 1/13/17.
 */

import Request from '../base-requests/request'
import Operation from '../operation'

//读取请求具体封装
export default class RequestFactory {
  // 统一的请求 
  static request(url,params,name,hasCookie){

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

 
  //获取热搜词

  static getHotWordsListActive(){
    let url = Operation.sharedInstance().getHotWordsListActive;
    return this.request(url,{}, '获取热搜词',true);
  }

  // 获取商品列表 queryProductListAPP
  
  /**************产品********************/

  
  static queryProductListAPP(params={}) {
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
    return this.request(url, params, '获取商品详情页', true);
  }

  static shoppingCartLimit(params) {
    let url = Operation.sharedInstance().shoppingCartLimit;
    return this.request(url, params, '最大数量同步购物车', true);
  }

  /**************地址管理********************/
  static addUserAddress(params) {
      params.port = '8102';
      let url = Operation.sharedInstance().addUserAddress;
      return this.request(url, params, '添加地址', true);
  }

  static queryUserAddressList(params) {
      params.port = '8102';
      let url = Operation.sharedInstance().queryUserAddressList;
      return this.request(url, params, '获取地址列表', true);
  }
  
  
  static updateUserAddress(params) {
    params.port = '8102';
    let url = Operation.sharedInstance().updateUserAddress;
    return this.request(url, params, '更新地址', true);
  }

  static setDefaultAddress(params) {
    params.port = '8102';
    let url = Operation.sharedInstance().setDefaultAddress;
    return this.request(url, params, '设置默认地址', true);
  }

  static deleteUserAddress(params) {
    params.port = '8102';
    let url = Operation.sharedInstance().deleteUserAddress;
    return this.request(url, params, '删除地址', true);
  }

}

