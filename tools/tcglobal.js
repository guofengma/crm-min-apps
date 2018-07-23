/**
 * Created by weiwei on 11/6/18.
 */

import Tool from './tool';
import RequestFactory from '../network/factory/request-read-factory';
import Storage from './storage';
import Event from './event';
import Touches from './Touches';

require('./DateFormat');

let TCGlobal = {
    Tool: Tool,
    Storage: Storage,
    Event: Event,
    Touches:Touches,
    RequestFactory: RequestFactory,
    version:'V1.0',
    BaiduMapKey: 'BazNALkeiEEMMvZjWmPeXlRqOyd0BlnL',
    AppId: 'wx228ac7ba52b9b1ed',//小程序AppID
    Secret: 'ac645290e3299966fabe3cf0d0034f9b',//小程序Secret
    WXPayKey: '',//商户平台32位密钥
    WXPayAccount: '',
    WXPayMchId: '',//商户Id
};

module.exports = TCGlobal;