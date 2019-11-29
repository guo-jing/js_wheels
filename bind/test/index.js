const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

const assert = chai.assert;
Function.prototype.bind = undefined;
Function.prototype.bind === undefined && (Function.prototype.bind = require('../src/index'));

describe('bind', function(){
    it('它是一个函数，返回值也是一个函数', function(){
        const fn = function(){};
        assert.isFunction(Function.prototype.bind);
        assert.isFunction(Function.prototype.bind(fn));
    });

    it('它可以通过函数的原型链访问到', function(){
        const fn = function(){};
        assert.isFunction(fn.bind);
    });

    it('它可以保存 this 参数', function(){
        const fn1 = function() {
            return this.name;
        };
        const obj1 = {
            name: 'obj1'
        };
        const obj2 = {
            name: 'obj2'
        };
        const fn2 = fn1.bind(obj1);
        assert.equal(fn2.call(obj2), 'obj1');
    });

    it('它可以接收其他参数', function() {
        const fn1 = function(p1, p2) {
            return [this.name, p1, p2];
        };
        const obj1 = {
            name: 'obj1'
        };
        const obj2 = {
            name: 'obj2'
        };
        const fn2 = fn1.bind(obj1, 1, 2);
        assert.deepEqual(fn2.call(obj2), ['obj1', 1, 2]);
    });

    it('它返回的函数也可以接收参数', function() {
        const fn1 = function(...p) {
            return [this.name, ...p];
        };
        const obj1 = {
            name: 'obj1'
        };
        const obj2 = {
            name: 'obj2'
        };
        const fn2 = fn1.bind(obj1, 1, 2);
        assert.deepEqual(fn2.call(obj2, 3, 4), ['obj1', 1, 2, 3, 4]);
    });

    it('通过 new 调用 bind 返回的方法', function() {
        const fn1 = function(name) {
            this.name = name;
        };
        const fn2 = fn1.bind();
        const obj = new fn2('baba');
        assert.equal(obj.name, 'baba');
    });

    it('通过 new 调用 bind 返回的方法时参数也能正常使用', function() {
        const fn1 = function(...names) {
            this.name = names;
        };
        const fn2 = fn1.bind({}, 'bababab', 'mamama');
        const obj = new fn2('yeyeye', 'nainainai');
        assert.deepEqual(obj.name, ['bababab', 'mamama', 'yeyeye', 'nainainai']);
    });

    it('通过 new 调用时，如果 bind 的参数函数有显式返回值则 new 的返回值就是这个返回值，' +
        '如果没有显示返回值就应该返回 new 创建的临时对象', function() {
        const fn1 = function() {
            return {a: 1};
        };
        const fn2 = fn1.bind();
        const result1 = new fn2();
        assert.equal(result1.a, 1);

        const fn3 = function(name) {
            this.name = name;
        };
        const fn4 = fn3.bind();
        const result2 = new fn4('aaa');
        assert.equal(result2.name, 'aaa');
    });

    it('直接 new 返回的对象和先 bind 再 new 返回的对象的原型应该一致', function() {
        const fn1 = function(name) {
            this.name = name;
        };
        fn1.prototype.aaa = 123;
        const fn2 = fn1.bind();
        const obj1 = new fn1('aaa');
        const obj2 = new fn2('bbb');
        assert.notEqual(obj1.name, obj2.name);
        assert.equal(Object.getPrototypeOf(obj1), Object.getPrototypeOf(obj2));
    })
});