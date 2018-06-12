/**
 * Created by coin on 1/13/17.
 */

import Request from '../base-requests/request'
import Operation from '../operation'

//读取请求具体封装
export default class RequestFactory {

    /*登陆*/
    static Login(phone){
    let url = Operation.sharedInstance().loginUrl;
      let bodyParameters = {
          "url": url,
          "phone": '18968047924',
          "password": '123456789',
      };
      let req = new Request(bodyParameters);
      req.name = '用户登陆';//用于日志输出
      return req;
    }

}

