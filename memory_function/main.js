const memo = (fn) => {
    if (typeof fn !== 'function') {
        // 没有匹配到函数函数表达式
        throw Error('fn is not a function');
    }

    let cache = []; // 初始化缓存空间
    let fnCallingMemo; // fn 是递归 ? 一个函数 : undefined
    const checkCache = function(...args) {
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
    let functionParams = functionNameReg.exec(fnString)[2]; // 形参
    let callingRegString = `\\W(${functionName})(\\s*\\(|\\.call\\(|\\.apply\\()`; // 第一个 \ 为了在字符串中转义后面的 \
    const callingReg1 = new RegExp(callingRegString, 'g'); // 全局匹配 "fn( | fn.call( | fn.apply(" 的正则

    if (callingReg1.exec(fnString) || callingReg1.exec(fnString) !== null) { // 连续执行两次 exec，第一次匹配的是函数名，第二次匹配的是方法中的递归调用
        // 是递归
        let memorizedFuncString = fnString; // 这是一个将要被搞得支离破碎的函数字符串
        let getFuncBodyRegStr = `function\\s*${functionName}\\s*\\(.*\\)\\s*\\{((.|\\n)+)\\}`;
        const getFuncBodyReg = new RegExp(getFuncBodyRegStr); // 用来截取 fn 函数体的正则
        memorizedFuncString = getFuncBodyReg.exec(memorizedFuncString)[1]; // 获得 fn 的函数体部分
        const callingReg2 = new RegExp(callingRegString, 'g');
        let resultArr;
        while((resultArr = callingReg2.exec(memorizedFuncString)) !== null) { // 把函数体所有递归调用换成 checkCache(xxx)
            let firstStr = memorizedFuncString.substring(0, resultArr.index + 1);
            let endStr = memorizedFuncString.substring(resultArr.index + 1 + resultArr[1].length);
            memorizedFuncString = firstStr + 'checkCache' + endStr;
            callingReg2.lastIndex = resultArr.index + 'checkCache'.length;
        }
        let formalParams = []; // 递归函数形参
        functionParams.split(/\s*,\s*/).forEach(function(args){
            formalParams.push(args)
        });
        formalParams[0] === '' // 添加这两个参数为 new Function 时使用
            ? formalParams = ['checkCache', memorizedFuncString]
            : formalParams.push('checkCache', memorizedFuncString);
        fnCallingMemo = function() {
            let actualArguments = []; // 递归函数实参
            for(let i = 0; i < arguments.length; i++) {
                actualArguments.push(arguments[i]);
            }
            actualArguments.push(checkCache); // 把当前作用域的 checkCache 方法作为参数传递下去
            fn = new Function(...formalParams);
            return fn.apply(this, actualArguments);
        };
        return fnCallingMemo;
    } else {
        // 不是递归
        return checkCache;
    }
};

export default memo;