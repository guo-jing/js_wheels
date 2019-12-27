const chaiJS = require("chai");
const sinon = require("sinon");
const sinonChai = require('sinon-chai');
chaiJS.use(sinonChai);

const assert = chaiJS.assert;
// @ts-ignore
const Promise = require('../src/index.ts');

// describe('Promise2', function(){
//     it('Promise 是一个构造函数', function(){
//         const p = new Promise2();
//         assert.equal(Object.getPrototypeOf(p), Promise2.prototype);
//     });
//
//     it('new Promise() 的参数如果是函数便会立即执行', function(done){
//         const fn = sinon.fake();
//         const p = new Promise2(fn);
//         setTimeout(() => {
//             assert(fn.called);
//             done();
//         });
//     });
//
//     it('new Promise() 的函数参数的第一个参数函数（resolve）被调用后会立即执行 then 的第一个函数参数', function(done){
//         const fn = resolve => {
//             resolve();
//         };
//         const success = sinon.fake();
//         const p = new Promise2(fn);
//         p.then(success);
//         setTimeout(() => {
//             assert(success.called);
//             done();
//         });
//     });
//
//     it('new Promise() 的函数参数的第二个参数函数（reject）被调用后会立即执行 then 的第二个函数参数', function(done){
//         const fn = (resolve, reject) => {
//             reject();
//         };
//         const fail = sinon.fake();
//         const p = new Promise2(fn);
//         p.then(null, fail);
//         setTimeout(() => {
//             assert(fail.called);
//             done();
//         });
//     });
//
//     it('Promise 对象的状态为 fulfilled 之后，无法再变为 rejected', function(done){
//         const fn = (resolve, reject) => {
//             resolve();
//             reject();
//         };
//         const success = sinon.fake();
//         const fail = sinon.fake();
//         const p = new Promise2(fn);
//         p.then(success, fail);
//         setTimeout(() => {
//             assert(success.called);
//             assert(fail.notCalled);
//             done();
//         });
//     });
//
//     it('Promise 对象的状态为 rejected 之后，无法再变为 fulfilled', function(done){
//         const fn = (resolve, reject) => {
//             reject();
//             resolve();
//         };
//         const success = sinon.fake();
//         const fail = sinon.fake();
//         const p = new Promise2(fn);
//         p.then(success, fail);
//         setTimeout(() => {
//             assert(success.notCalled);
//             assert(fail.called);
//             done();
//         });
//     });
//
//     it('如果 onFulfilled 不是函数，必须忽略', function(done){
//         const fn = (resolve, reject) => {
//             resolve();
//         };
//         const success = 1;
//         const p = new Promise2(fn);
//         p.then(success);
//         setTimeout(() => {
//             assert(true);
//             done();
//         })
//     });
//
//     it('如果 onRejected不是函数，必须忽略', function(done){
//         const fn = (resolve, reject) => {
//             reject();
//         };
//         const fail = 1;
//         const p = new Promise2(fn);
//         p.then(null, fail);
//         setTimeout(() => {
//             assert(true);
//             done();
//         })
//     });
//
//     it('onFulfilled 函数的参数是 resolve 被调用时的参数', function(done){
//         const fn = (resolve, reject) => {
//             resolve(123);
//         };
//         const success = arg => {
//             assert(arg === 123);
//             done();
//         };
//         const p = new Promise2(fn);
//         p.then(success);
//     });
//
//     it('onFulfilled 函数绝对不能被调用超过一次', function(done){
//         const fn = (resolve, reject) => {
//             resolve();
//             resolve();
//         };
//         const success = sinon.fake();
//         const p = new Promise2(fn);
//         p.then(success);
//         assert(success.notCalled);
//         setTimeout(() => {
//             assert(success.calledOnce);
//             done();
//         })
//     });
//
//     it('onRejected 函数的参数是 reject 被调用时的参数', function(done){
//         const fn = (resolve, reject) => {
//             reject(123);
//         };
//         const fail = arg => {
//             assert(arg === 123);
//             done();
//         };
//         const p = new Promise2(fn);
//         p.then(null, fail);
//     });
//
//     it('onRejected 函数绝对不能被调用超过一次', function(done){
//         const fn = (resolve, reject) => {
//             reject();
//             reject();
//         };
//         const fail = sinon.fake();
//         const p = new Promise2(fn);
//         p.then(null, fail);
//         assert(fail.notCalled);
//         setTimeout(() => {
//             assert(fail.calledOnce);
//             done();
//         })
//     });
// });

describe("Promise", () => {
    it("是一个类", () => {
        assert.isFunction(Promise);
        assert.isObject(Promise.prototype);
    });
    it("new Promise() 如果接受的不是一个函数就报错", () => {
        assert.throw(() => {
            // @ts-ignore
            new Promise();
        });
        assert.throw(() => {
            // @ts-ignore
            new Promise(1);
        });
        assert.throw(() => {
            // @ts-ignore
            new Promise(false);
        });
    });
    it("new Promise(fn) 会生成一个对象，对象有 then 方法", () => {
        const promise = new Promise(() => {});
        assert.isFunction(promise.then);
    });
    it("new Promise(fn) 中的 fn 立即执行", () => {
        let fn = sinon.fake();
        new Promise(fn);
        assert(fn.called);
    });
    it("new Promise(fn) 中的 fn 执行的时候接受 resolve 和 reject 两个函数", done => {
        new Promise((resolve, reject) => {
            assert.isFunction(resolve);
            assert.isFunction(reject);
            done();
        });
    });
    it("promise.then(success) 中的 success 会在 resolve 被调用的时候执行", done => {
        const success = sinon.fake();
        const promise = new Promise((resolve, reject) => {
            assert.isFalse(success.called);
            resolve();
            setTimeout(() => {
                assert.isTrue(success.called);
                done();
            });
        });
        // @ts-ignore
        promise.then(success);
    });
    it("promise.then(null, fail) 中的 fail 会在 reject 被调用的时候执行", done => {
        const fail = sinon.fake();
        const promise = new Promise((resolve, reject) => {
            assert.isFalse(fail.called);
            reject();
            setTimeout(() => {
                assert.isTrue(fail.called);
                done();
            });
        });
        // @ts-ignore
        promise.then(null, fail);
    });
    it("2.2.1 onFulfilled和onRejected都是可选的参数：", () => {
        const promise = new Promise(resolve => {
            resolve();
        });
        // @ts-ignore
        promise.then(false, null);
        assert(1 === 1);
    });
    it("2.2.2 如果onFulfilled是函数", done => {
        const succeed = sinon.fake();
        const promise = new Promise(resolve => {
            assert.isFalse(succeed.called);
            resolve(233);
            resolve(2333);
            setTimeout(() => {
                // @ts-ignore
                assert(promise.state === "fulfilled");
                assert.isTrue(succeed.calledOnce);
                assert(succeed.calledWith(233));
                done();
            }, 0);
        });
        promise.then(succeed);
    });
    it("2.2.3 如果onRejected是函数", done => {
        const fail = sinon.fake();
        const promise = new Promise((resolve, reject) => {
            assert.isFalse(fail.called);
            reject(233);
            reject(2333);
            setTimeout(() => {
                // @ts-ignore
                assert(promise.state === "rejected");
                assert.isTrue(fail.calledOnce);
                assert(fail.calledWith(233));
                done();
            }, 0);
        });
        promise.then(null, fail);
    });
    it("2.2.4 在我的代码执行完之前，不得调用 then 后面的俩函数", done => {
        const succeed = sinon.fake();
        const promise = new Promise(resolve => {
            resolve();
        });
        promise.then(succeed);
        assert.isFalse(succeed.called);
        setTimeout(() => {
            assert.isTrue(succeed.called);
            done();
        }, 0);
    });
    it("2.2.4 失败回调", done => {
        const fn = sinon.fake();
        const promise = new Promise((resolve, reject) => {
            reject();
        });
        promise.then(null, fn);
        assert.isFalse(fn.called);
        setTimeout(() => {
            assert.isTrue(fn.called);
            done();
        }, 0);
    });
    it("2.2.5 onFulfilled和onRejected必须被当做函数调用", done => {
        const promise = new Promise(resolve => {
            resolve();
        });
        promise.then(function() {
            "use strict";
            assert(this === undefined);
            done();
        });
    });
    it("2.2.6 then可以在同一个promise里被多次调用", done => {
        const promise = new Promise(resolve => {
            resolve();
        });
        const callbacks = [sinon.fake(), sinon.fake(), sinon.fake()];
        promise.then(callbacks[0]);
        promise.then(callbacks[1]);
        promise.then(callbacks[2]);
        setTimeout(() => {
            assert(callbacks[0].called);
            assert(callbacks[1].called);
            assert(callbacks[2].called);
            assert(callbacks[1].calledAfter(callbacks[0]));
            assert(callbacks[2].calledAfter(callbacks[1]));
            done();
        });
    });
    it("2.2.6.2 then可以在同一个promise里被多次调用", done => {
        const promise = new Promise((resolve, reject) => {
            reject();
        });
        const callbacks = [sinon.fake(), sinon.fake(), sinon.fake()];
        promise.then(null, callbacks[0]);
        promise.then(null, callbacks[1]);
        promise.then(null, callbacks[2]);
        setTimeout(() => {
            assert(callbacks[0].called);
            assert(callbacks[1].called);
            assert(callbacks[2].called);
            assert(callbacks[1].calledAfter(callbacks[0]));
            assert(callbacks[2].calledAfter(callbacks[1]));
            done();
        });
    });
});