const chaiJS = require("chai");
const sinon = require("sinon");
const sinonChai = require('sinon-chai');
chaiJS.use(sinonChai);

const assert = chaiJS.assert;
// @ts-ignore
const Promise2 = require('../src/index.ts');

describe('Promise2', function(){
    it('Promise 是一个构造函数', function(){
        const p = new Promise2(() => {});
        assert.equal(Object.getPrototypeOf(p), Promise2.prototype);
    });

    it('new Promise() 的参数如果是函数便会立即执行', function(done){
        const fn = sinon.fake();
        const p = new Promise2(fn);
        setTimeout(() => {
            assert(fn.called);
            done();
        });
    });

    it('new Promise() 的函数参数的第一个参数函数（resolve）被调用后会立即执行 then 的第一个函数参数', function(done){
        const fn = resolve => {
            resolve();
        };
        const success = sinon.fake();
        const p = new Promise2(fn);
        p.then(success);
        setTimeout(() => {
            assert(success.called);
            done();
        });
    });

    it('new Promise() 的函数参数的第二个参数函数（reject）被调用后会立即执行 then 的第二个函数参数', function(done){
        const fn = (resolve, reject) => {
            reject();
        };
        const fail = sinon.fake();
        const p = new Promise2(fn);
        p.then(null, fail);
        setTimeout(() => {
            assert(fail.called);
            done();
        });
    });

    it('Promise 对象的状态为 fulfilled 之后，无法再变为 rejected', function(done){
        const fn = (resolve, reject) => {
            resolve();
            reject();
        };
        const success = sinon.fake();
        const fail = sinon.fake();
        const p = new Promise2(fn);
        p.then(success, fail);
        setTimeout(() => {
            assert(success.called);
            assert(fail.notCalled);
            done();
        });
    });

    it('Promise 对象的状态为 rejected 之后，无法再变为 fulfilled', function(done){
        const fn = (resolve, reject) => {
            reject();
            resolve();
        };
        const success = sinon.fake();
        const fail = sinon.fake();
        const p = new Promise2(fn);
        p.then(success, fail);
        setTimeout(() => {
            assert(success.notCalled);
            assert(fail.called);
            done();
        });
    });

    it('如果 onFulfilled 不是函数，必须忽略', function(done){
        const fn = (resolve, reject) => {
            resolve();
        };
        const success = 1;
        const p = new Promise2(fn);
        p.then(success);
        setTimeout(() => {
            assert(true);
            done();
        })
    });

    it('如果 onRejected不是函数，必须忽略', function(done){
        const fn = (resolve, reject) => {
            reject();
        };
        const fail = 1;
        const p = new Promise2(fn);
        p.then(null, fail);
        setTimeout(() => {
            assert(true);
            done();
        })
    });

    it('onFulfilled 函数的参数是 resolve 被调用时的参数', function(done){
        const fn = (resolve, reject) => {
            resolve(123);
        };
        const success = arg => {
            assert(arg === 123);
            done();
        };
        const p = new Promise2(fn);
        p.then(success);
    });

    it('onFulfilled 函数绝对不能被调用超过一次', function(done){
        const fn = (resolve, reject) => {
            resolve();
            resolve();
        };
        const success = sinon.fake();
        const p = new Promise2(fn);
        p.then(success);
        assert(success.notCalled);
        setTimeout(() => {
            assert(success.calledOnce);
            done();
        })
    });

    it('onRejected 函数的参数是 reject 被调用时的参数', function(done){
        const fn = (resolve, reject) => {
            reject(123);
        };
        const fail = arg => {
            assert(arg === 123);
            done();
        };
        const p = new Promise2(fn);
        p.then(null, fail);
    });

    it('onRejected 函数绝对不能被调用超过一次', function(done){
        const fn = (resolve, reject) => {
            reject();
            reject();
        };
        const fail = sinon.fake();
        const p = new Promise2(fn);
        p.then(null, fail);
        assert(fail.notCalled);
        setTimeout(() => {
            assert(fail.calledOnce);
            done();
        })
    });

    it('then 必须返回一个 Promise', function() {
        const p1 = new Promise2(() => {});
        const p2 = p1.then();
        assert(p2 instanceof Promise2);
    });
});