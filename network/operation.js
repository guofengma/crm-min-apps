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
        this.loginUrl = '/admin/adminLogin/pswLogin'
        

        __instance(this);
    }

    static sharedInstance() {
        return new Operation();
    }
}