const memo = (fn) => {
    if (typeof fn !== 'function') {
        // 没有匹配到函数函数表达式
        throw Error('fn is not a function');
    }

    let cache = []; // 初始化缓存空间
    let fnCallingMemo; // fn 是递归 ? 一个函数 : undefined
    const checkCache = function(...args) {
        console.log('call checkCache');
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
        console.log('call fn');
        let result = fnCallingMemo ? fnCallingMemo.apply(this, args) : fn.apply(this, args);
        cache.push({
            params: args,
            result
        });
        return result
    };

    let fnString = fn.toString(); // 返回一个表示当前函数源代码的字符串
    const functionNameReg = /^function\s*(\w+)\s*\(\s*(.*)\s*\)/;
    let functionName;
    if (functionNameReg.exec(fnString) === null) {
        // 箭头函数
        return checkCache;
    }
    functionName = functionNameReg.exec(fnString)[1]; // 返回 reg1 的第一个分组，也就是函数名
    let functionParams = functionNameReg.exec(fnString)[2];
    let callingRegString = `\\W(${functionName})(\\s*\\(|\\.call\\(|\\.apply\\()`; // 第一个 \ 为了在字符串中转义后面的 \
    const callingReg1 = new RegExp(callingRegString, 'g'); // 全局匹配 "fn( | fn.call( | fn.apply(" 的正则

    if (callingReg1.exec(fnString) || callingReg1.exec(fnString) !== null) { // 连续执行两次 exec，第一次匹配的是函数名，第二次匹配的是方法中的递归调用
        // 是递归
        let memorizedFuncString = fnString;
        let getFuncBodyRegStr = `function\\s*${functionName}\\s*\\(.*\\)\\s*\\{((.|\\n)+)\\}`;
        const getFuncBodyReg = new RegExp(getFuncBodyRegStr); // 用来截取 fn 函数体的正则
        memorizedFuncString = getFuncBodyReg.exec(memorizedFuncString)[1]; // 获得 fn 的函数体部分
        const callingReg2 = new RegExp(callingRegString, 'g');
        let resultArr;
        while((resultArr = callingReg2.exec(memorizedFuncString)) !== null) {
            let firstStr = memorizedFuncString.substring(0, resultArr.index + 1);
            let endStr = memorizedFuncString.substring(resultArr.index + 1 + resultArr[1].length);
            memorizedFuncString = firstStr + 'checkCache' + endStr;
            callingReg2.lastIndex = resultArr.index + 'checkCache'.length;
        }
        let MemoFuncParams = [];
        functionParams.split(/\s*,\s*/).forEach(function(args){
            MemoFuncParams.push(args)
        });
        return function() {
            arguments.forEach(function(arg){

            })
            MemoFuncParams[0] === ''
                ? MemoFuncParams = [memorizedFuncString]
                : MemoFuncParams.push(memorizedFuncString);
            fnCallingMemo = new Function(...MemoFuncParams);
            this.fnCallingMemo(...arguments)
        };
        return fnCallingMemo;
    } else {
        // 不是递归
        return checkCache;
    }
};

export default memo;

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