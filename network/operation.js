/**
 * Created by coin on 1/13/17.
 */

let __instance = (function () {
    let instance;
    return (newInstance) => {
        if (newInstance) instance = newInstance;
        return instance;
    }
}());

//操作常量定义
export default class Operation {

    constructor() {
        if (__instance()) return __instance();
        // 微信登陆
        this.wechatLogin = '/user/memberLogin/wechatLogin'
        // 判断手机号是否可用
        this.findMemberByPhone = '/user/memberSign/findMemberByPhone'
        // 注册
        this.signMember = '/user/memberSign/signMember'
        // 获取注册验证码
        this.sendRegistrationCode ='/commonAPI/phoneCode/sendRegistrationCode'
        // 获取推荐人列表
        this.queryInviterList = '/user/memberSign/queryInviterList'
        this.verifyWechat = '/user/memberLogin/verifyWechat'
        __instance(this);
    }

    static sharedInstance() {
        return new Operation();
    }
}