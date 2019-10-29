import memo from './main.js';

function fibo(n) {
    return n === 1 || n === 2 ? 1 : fibo(n - 2) + fibo(n - 1);
}

const memorizedFibo = memo(fibo);
console.time('不记忆化的 Fibo');
console.log(fibo(42));
console.timeEnd('不记忆化的 Fibo');
console.time('记忆化的 Fibo');
console.log(memorizedFibo(42));
console.timeEnd('记忆化的 Fibo');