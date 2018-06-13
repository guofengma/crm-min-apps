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

  /*微信登陆*/
  static wechatLogin(params){
    let url = Operation.sharedInstance().wechatLogin;
    params.url = url
    return this.request(url, params, '用户微信登陆');
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

  // 获取openid verifyWechat
  static verifyWechat(params) {
    let url = Operation.sharedInstance().verifyWechat;
    return this.request(url, params,'获取openid和是否注册');
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
}

