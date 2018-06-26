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


    /*************  注册登录相关接口 *********************/
       
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
        
        // 实名制
        this.signMemberInfo = '/user/memberSign/signMemberInfo'


    /**********  获取省市区 *******************/

        // 获取省
        this.getProvinceList = '/admin/area/getProvinceList'

        // 获取市
        this.getCityList = '/admin/area/getCityList'

        // 获取区
        this.getAreaList = '/admin/area/getAreaList'

    /********************** 搜索 *********************/  
    
        this.getHotWordsListActive = '/user/hotWord/getHotWordListActive'
          
    /********************** 产品 *********************/

        // 产品列表
        this.queryProductListAPP = '/user/productApp/queryProductListApp'

        // 产品详情

        this.findProductByIdApp = '/user/productApp/findProductByIdApp'


    /********************** 购物车 *********************/
        // 新增
        
        this.addToShoppingCart  = '/user/shoppingCart/addToShoppingCart'

        // 修改

        this.updateShoppingCart = '/user/shoppingCart/updateShoppingCartItemsByProductId'

        // 同步

        this.shoppingCartFormCookieToSession ='/user/shoppingCart/shoppingCartFormCookieToSession'

        // 查询

        this.getShoppingCartList  ='/user/shoppingCart/getShoppingCartList'

        // 删除

        this.deleteFromShoppingCart = '/user/shoppingCart/deleteFromShoppingCartByProductId'

        // 购物车超过上限

        this.shoppingCartLimit = '/user/shoppingCart/shoppingCartFormCookieToSessionProductNumberIsAble'

        __instance(this);

        /********************** 地址管理 *********************/
        this.addUserAddress  ='/user/userAddress/addUserAddress';
        this.queryUserAddressList  ='/user/userAddress/queryUserAddressList'

        
    }

    static sharedInstance() {
        return new Operation();
    }
}