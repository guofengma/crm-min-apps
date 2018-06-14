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
        
        // 验证openid是否注册
        this.verifyWechat = '/user/memberLogin/verifyWechat'

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

        // 使用账号密码手动登录
        this.passwordLogin = '/user/memberLogin/passwordLogin'

        // 忘记密码 
        this.resetPassword = '/user/memberLogin/resetPassword'

        // 忘记密码短信
        this.sendUserUpdateCode = '/commonAPI/phoneCode/sendUserUpdateCode'

        // 获取省
        this.getProvinceList = '/admin/area/getProvinceList'

        // 获取市
        this.getCityList = '/admin/area/getCityList'
       
        // 获取区
        this.getAreaList = '/admin/area/getAreaList'

        
        __instance(this);
    }

    static sharedInstance() {
        return new Operation();
    }
}