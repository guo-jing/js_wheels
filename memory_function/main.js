const memo = (fn) => {
    let cache = []; // 初始化缓存空间

    let fnString = fn.toString(); // 返回一个表示当前函数源代码的字符串
    let reg1 = /^function (.+)\(/;

    if (reg1.exec(fnString) === null) {
        // 没有匹配到函数函数表达式
        throw Error('fn is not a function');
    }

    let functionName = reg1.exec(fnString)[1]; // 返回 reg1 的第一个分组，也就是函数名
    let reg2String = `(${functionName}\\()|(${functionName}\\.call\\()|(${functionName}\\.apply\\()`; // 第一个 \ 为了在字符串中转义后面的 \ ，第二个 \ 为了在正则表达式中转义后面的 (
    let reg2 = new RegExp(reg2String, 'g'); // 全局匹配 "fn( | fn.call( | fn.apply(" 的正则
    if (reg2.exec(fnString) && reg2.exec(fnString) !== null) { // 连续执行两次 exec，第一次匹配的是函数名，第二次匹配的是方法中的递归调用
        // 是递归
        let reg3String = `function ${fn.name}\\(.*\\) \\{`;
        let reg3 = new RegExp(reg3String);
        let memorizedRecursionString = fnString.replace(reg3, `$&
            if (cache.length !== 0) {
                for (let i = 0; i < cache.length; i++) {
                    if (cache[i].params.length !== arguments.length) {
                        continue;
                    } else {
                        let j = 0;
                        for (; j < arguments.length; j++) {
                            if (cache[i].params[j] !== arguments[j]) {
                                break;
                            }
                        }
                        if (j === arguments.length) {
                            return cache[i].result;
                        }
                    }
                }
            }
        `);
        let memorizedRecursion = new Function(memorizedRecursionString);
        return memorizedRecursion;
    } else {
        // 不是递归
        console.log('is not');
    }

    return function(...args) {
        if (cache.length !== 0) {
            for (let i = 0; i < cache.length; i++) {
                // 如果 cache[i] 中的参数长度和此次函数调用的参数的长度不相等，就没必要再比较具体参数
                if (cache[i].params.length !== args.length) {
                    continue;
                } else {
                    let j = 0;
                    for (; j < args.length; j++) {
                        if (cache[i].params[j] !== args[j]) {
                            break;
                        }
                    }
                    // 如果上面循环中每次参数比较都相等，就直接返回结果
                    if (j === args.length) {
                        return cache[i].result;
                    }
                }
            }
        }
        // 运行到此处说明此次调用是一个新参数列表
        let result = fn.apply(this, args);
        cache.push({
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
//测试