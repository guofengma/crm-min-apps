/**
 * Created by weiwei on 11/6/18.
 */
'use strict';

import RequestQueue from './request-queue';
import RequestStatus from './request-status';


//请求基类
export default class Request {

    constructor(bParam) {
        //request自己控制loading提示
        this.manageLoadingPrompt = true;

        //接口URL
        // this.baseUrl = 'http://172.16.10.51:8102';
        if (bParam.port) {
          this.baseUrl = 'http://172.16.10.51:' + bParam.port
        } else {
          this.baseUrl = 'http://172.16.10.51:8102';
        }

        //拼接了bodyParam的最终url
        this._url = '';

        //用于日志输出
        this.name = 'base request';

        //请求方法
        this.requestMethod = 'POST';

        //接收入参
        this.bodyParam = bParam;

        //最后拼接后传给服务器
        this._body = {};

        //响应结果
        this.responseObject = {};


        //当前尝试的次数
        this.tryCount = 0;

        //最多尝试重发请求的次数
        this.maxTryCount = 2;

        //请求的状态
        this.requestStatus = RequestStatus.waiting;

        //是否有队列管理请求
        this.isManagedByQueue = false;

        /**
         * 调用finishBlock前的预处理，可作为factory中的统一处理
         */
        this.preprocessCallback = (req,firstData) => {};

        //成功回调
        this.finishBlock = (req,firstData) => {};

        //失败回调
        this.failBlock = (req) => {};

        //结束回调，不管成功or失败
        this.completeBlock = (req) => {};
    }

    //添加到请求队列中
    addToQueue(){
        this.isManagedByQueue = true;
        RequestQueue.addRequest(this);
    }

    //发起请求
    start() {
        let that = this;
        this.url();
        this.body();
        this.requestStatus = RequestStatus.requesting;
        wx.request({
            data:this._body,
            url: this._url,
            dataType:'json',
            method:this.requestMethod,
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {

                if (that.managerLoadingPrompt) {
                    global.Tool.hideLoading();
                }

                console.log('<============================== 请求结束：' + that.name);
                console.debug('result:');
                console.debug('==============================\n\n\n');

                //成功
                that.responseObject = res.data;
                //成功
                if (res.data.code == '200') {
                  let Datas = that.responseObject.data;
                  let firstData = {};
                  firstData = Datas
                  //预处理，可以重新组织请求结果
                  that.preprocessCallback(that, firstData)
                  that.finishBlock(that, firstData)
                }

                //失败，有异常
                else
                {

                    //弹窗，提示服务器错误
                    that.failBlock(that);
                    global.Tool.showAlert(res.data.msg);

                    let error = res.data.brief;
                    console.debug('请求出错：'+error);
                }
            },
            fail:function () {
                that.tryCount ++;

                console.debug('<============================== 请求结束：' + that.name + '第' + that.tryCount + '次请求');
                console.debug('==============================\n\n\n');
                //请求失败重试
                if (that.tryCount < that.maxTryCount) {
                    if (that.isManagedByQueue) {
                        that.addToQueue();
                    }
                    else{
                        that.start();
                    }
                }

                //达到重试上限，提示错误
                else
                {
                    //弹窗，提示服务器错误
                    that.failBlock(that);
                    global.Tool.showAlert('请求失败，请稍后重试')
                }
            },
            complete:function () {
                that.requestStatus = RequestStatus.finish;
                that.completeBlock(that);

                if (that.isManagedByQueue) {
                    RequestQueue.removeRequest(that);
                }

                if (that.manageLoadingPrompt) {
                    global.Tool.hideLoading();
                }
            }
        });

        console.debug('------------------------------> 请求发起：' + that.name);

        console.debug('url: ' + this._url);
        console.debug('body:');
        console.debug(JSON.stringify(this._body));
        console.debug(this._body);
        console.debug('------------------------------\n\n\n');

        if (this.manageLoadingPrompt) {
            global.Tool.showLoading();
        }

        return this;
    }

    //拼接url
    url() {
      this._url = this.baseUrl + this.bodyParam.url
      return this._url;
    }

    //拼接body
    body() {

      delete this.bodyParam.url
      delete this.bodyParam.port
      this._body = this.bodyParam
      return this._body;
    }
}

