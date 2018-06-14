/**
 * Created by coin on 1/13/17.
 */

import Request from '../base-requests/request'
import Operation from '../operation'

//读取请求具体封装
export default class RequestFactory {
  // 统一的请求 
  static request(url,params,name){
    params.url = url
    let req = new Request(params);
    req.name = name;//用于日志输出
    return req;
  }
  
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

  // 注册 --判断手机号是否可用
  static findMemberByPhone(params) {
    let url = Operation.sharedInstance().findMemberByPhone;
    return this.request(url, params, '判断手机号是否已经注册');
  }

  // 注册用户
  static signMember(params) {
    let url = Operation.sharedInstance().signMember;
    return this.request(url, params, '注册');
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
  static queryInviterList(){
    let url = Operation.sharedInstance().queryInviterList;
    return this.request(url, {}, '获取邀请者列表');
  }

  // 忘记密码
  static resetPassword(params) {
    let url = Operation.sharedInstance().resetPassword;
    return this.request(url,params, '重置密码');
  }

  // 重置密码短信验证
  static sendUserUpdateCode(params) {
    params.port = '8100'
    let url = Operation.sharedInstance().sendUserUpdateCode;
    return this.request(url, params, '重置密码短信验证');
  }

  // 获取省
  static getProvinceList() {
    let url = Operation.sharedInstance().getProvinceList;
    return this.request(url, {port:'8101'}, '获取省份');
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

  // 实名制 
  static signMemberInfo(params) {
    let url = Operation.sharedInstance().signMemberInfo;
    return this.request(url, params, '用户实名制');
  }

}

