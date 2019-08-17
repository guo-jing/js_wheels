const memo = (fn) => {
    let cash = []; // 初始化缓存空间
    return function(...args) {
        if (cash.length !== 0) {
            for (let i = 0; i < cash.length; i++) {
                // 如果 cash[i] 中的参数长度和此次函数调用的参数的长度不相等，就没必要再比较具体参数
                if (cash[i].params.length !== args.length) {
                    continue;
                } else {
                    let j = 0;
                    for (; j < args.length; j++) {
                        if (cash[i].params[j] !== args[j]) {
                            break;
                        }
                    }
                    // 如果上面循环中每次参数比较都相等，就直接返回结果
                    if (j === args.length) {
                        return cash[i].result;
                    }
                }
            }
        }
        // 运行到此处说明此次调用是一个新参数列表
        let result = fn.apply(this, args);
        cash.push({
            params: args,
            result
        });
        return result
    }
};

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