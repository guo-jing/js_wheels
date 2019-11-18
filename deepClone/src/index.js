let cache = [];

function deepClone(source, isRecursionCall) {
    if (!isRecursionCall) {
        cache = [];
    }
    if (source instanceof Object) {
        let result;
        if (source instanceof RegExp) {
            result = new RegExp(source.source, source.flags);
        } else if (source instanceof Date) {
            result = new Date(source);
        } else if (source instanceof Function) {
            result = function () {
                return source.apply(this, arguments);
            };
        } else if (source instanceof Array) {
            result = [];
        } else {
            result = {};
        }
        for (let key in source) {
            if (source[key] instanceof Object) {
                let i;
                for (i = 0; i < cache.length; i++) {
                    if (cache[i][0] === source[key]) {
                        break;
                    }
                }
                if (i < cache.length) {
                    result[key] = cache[i][1];
                } else {
                    cache.push([source[key], result[key]]);
                    result[key] = deepClone(source[key], true);
                }
            } else {
                result[key] = source[key];
            }
        }
        return result;
    } else {
        return source;
    }
}

module.exports = deepClone;