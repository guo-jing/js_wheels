fibo = (n) => n === 1 || n === 2 ? 1 : fibo(n - 2) + fibo(n - 1);
let cache = [];
memorizedFibo = function (n) {
    if (cache.length !== 0) {
        for (let i = 0; i < cache.length; i++) {
            if (cache[i].params === n) {
                return cache[i].result;
            }
        }
    }
    let result;
    if (n === 1 || n === 2) {
        result = 1;
    } else {
        result = memorizedFibo(n-2) + memorizedFibo(n-2);
    }
    cache.push({
        params: n,
        result
    });
    return result
};
console.time('不记忆化的 Fibo');
fibo(42);
console.timeEnd('不记忆化的 Fibo');
console.time('记忆化的 Fibo');
memorizedFibo(42);
console.timeEnd('记忆化的 Fibo');