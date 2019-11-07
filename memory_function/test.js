import memo from './main.js';

console.log('测试普通函数：');
const x2 = memo((x) => {
    console.log('执行了一次')
    return x * 2
})

// 第一次调用 x2(1)
console.log(x2(1)) // 打印出执行了，并且返回2
// 第二次调用 x2(1)
console.log(x2(1)) // 不打印执行，并且返回上次的结果2
// 第三次调用 x2(1)
console.log(x2(1)) // 不打印执行，并且返回上次的结果2

console.log('测试递归函数：');
function fibo(n) {
    return n === 1 || n === 2 ? 1 : fibo(n - 2) + fibo(n - 1);
}

const memorizedFibo = memo(fibo);
console.time('不记忆化的 Fibo 用时');
console.log(fibo(42));
console.timeEnd('不记忆化的 Fibo 用时');
console.time('记忆化的 Fibo 用时');
console.log(memorizedFibo(42));
console.timeEnd('记忆化的 Fibo 用时');

