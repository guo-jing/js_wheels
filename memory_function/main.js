const memo = (fn) => {
    let cash = [];
    return function(...args) {
        if (cash.length !== 0) {
            for (let i = 0; i < cash.length; i++) {
                if (cash[i].params.length !== args.length) {
                    continue;
                } else {
                    let j = 0;
                    for (; j < args.length; j++) {
                        if (cash[i].params[j] !== args[j]) {
                            break;
                        }
                    }
                    if (j === args.length) {
                        return cash[i].result;
                    }
                }
            }
        }
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