const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

const assert = chai.assert;
const deepClone = require('../src/index');

describe('deepClone', function() {
    it('它是一个函数', function() {
        assert.typeOf(deepClone, 'function');
    });

    it('它可以拷贝基本类型', function() {
        assert.equal(undefined, deepClone(undefined));
        assert.equal(null, deepClone(null));
        assert.equal(true, deepClone(true));
        assert.equal(0, deepClone(0));
        assert.isNaN(deepClone(NaN));
        assert.equal(Infinity, deepClone(Infinity));
        assert.equal('', deepClone(''));
        const s = Symbol();
        assert.equal(s, deepClone(s));
    });

    it('它可以拷贝对象', function() {
        const s = Symbol();
        const a = {
            a1: undefined,
            a2: null,
            a3: true,
            a4: 0,
            a5: NaN,
            a6: Infinity,
            a7: '',
            a8: s
        };
        const b = deepClone(a);
        assert.notEqual(a, b);
        assert.deepEqual(a, b);
    });

    it('它可以拷贝函数', function() {
        const c = 3;
        const fn = function(a){
            return a + this.b + c;
        };
        const s = Symbol();
        fn.a1 = undefined;
        fn.a2 = null;
        fn.a3 = true;
        fn.a4 = 0;
        fn.a5 = NaN;
        fn.a6 = Infinity;
        fn.a7 = '';
        fn.a8 = s;
        const fn2 = deepClone(fn);

        assert.isFunction(fn2);
        assert.notEqual(fn, fn2);
        const obj = {b: 2};
        assert.equal(fn.call(obj, 1), fn2.call(obj, 1));
        assert.equal(fn.a1, fn2.a1);
        assert.equal(fn.a2, fn2.a2);
        assert.equal(fn.a3, fn2.a3);
        assert.equal(fn.a4, fn2.a4);
        assert.isNaN(fn2.a5);
        assert.equal(fn.a6, fn2.a6);
        assert.equal(fn.a7, fn2.a7);
        assert.equal(fn.a8, fn2.a8);
    });

    it('它可以拷贝数组', function() {
        const arr = [0, 1, 2];
        const s = Symbol();
        arr.a1 = undefined;
        arr.a2 = null;
        arr.a3 = true;
        arr.a4 = 0;
        arr.a5 = NaN;
        arr.a6 = Infinity;
        arr.a7 = '';
        arr.a8 = s;
        const arr2 = deepClone(arr);

        assert.isArray(arr2);
        assert.notEqual(arr, arr2);
        assert.deepEqual(arr, arr2);
        assert.equal(arr.a1, arr2.a1);
        assert.equal(arr.a2, arr2.a2);
        assert.equal(arr.a3, arr2.a3);
        assert.equal(arr.a4, arr2.a4);
        assert.isNaN(arr2.a5);
        assert.equal(arr.a6, arr2.a6);
        assert.equal(arr.a7, arr2.a7);
        assert.equal(arr.a8, arr2.a8);
    });

    it('它可以拷贝环形数据结构', function() {
        // 对象
        const obj1 = {
            name: 'clone'
        };
        obj1.next = obj1;
        const obj2 = deepClone(obj1);

        assert.equal(obj1.name, obj2.name);
        assert.notEqual(obj1.next, obj2.next);
        assert.equal(obj1.next.name, obj2.next.name);
        assert.notEqual(obj1.next.next, obj2.next.next);

        // 函数
        const c = 3;
        const fn1 = function(a){
            return a + this.b + c;
        };
        fn1.next = fn1;
        fn1.a = 'a';
        const fn2 = deepClone(fn1);

        assert.equal(fn1.a, fn2.a);
        assert.notEqual(fn1.next, fn2.next);
        const obj = {b: 2};
        assert.equal(fn1.next.call(obj, 1), fn2.next.call(obj, 1));
        assert.equal(fn1.next.a, fn2.next.a);
        assert.notEqual(fn1.next.next, fn2.next.next);

        // 数组
        const arr1 = [0];
        arr1.name = 'array';
        arr1.push(arr1);
        const arr2 = deepClone(arr1);

        assert.equal(arr1.name, arr2.name);
        assert.notEqual(arr1[1], arr2[1]);
        assert.equal(arr1[1][0], arr2[1][0]);
        assert.equal(arr1[1].name, arr2[1].name);
        assert.notEqual(arr1[1][1], arr2[1][1]);
    });

    it('它可以拷贝正则', function() {
        const reg1 = /1/g;
        const str = '111';
        reg1.exec(str);
        const reg2 = deepClone(reg1);

        assert.isTrue(reg2 instanceof RegExp);
        assert.notEqual(reg1, reg2);
        assert.equal(reg1.source, reg2.source);
        assert.equal(reg1.flags, reg2.flags);
    });

    it('它可以拷贝 Date 类型', function() {
        const date1 = new Date();
        const date2 = deepClone(date1);

        assert.isTrue(date2 instanceof Date);
        assert.notEqual(date1, date2);
        assert.equal(date1.getTime(), date2.getTime());
    })
});