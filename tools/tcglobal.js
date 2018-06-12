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
    AppId: 'wx3f1c8ad140687127',//小程序AppID
    Secret: '55961528510cb626af2f8e82c884d524',//小程序Secret
    WXPayKey: '',//商户平台32位密钥
    WXPayAccount: '',
    WXPayMchId: '',//商户Id
};

module.exports = TCGlobal;