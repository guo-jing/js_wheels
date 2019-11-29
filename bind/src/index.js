var Supports = require("es-checker");

var bind;
if (Supports.letConst
    && Supports.spreadRest
    && Supports.destructuring
    && Supports.parameterDestructuring) {
    bind = function(boundThis, ...args1) {
        const fn = this;
        const resultFunction = function(...args2) {
            return fn.call(
                this instanceof resultFunction ? this : boundThis,
                ...args1,
                ...args2);
        };
        resultFunction.prototype = fn.prototype;
        return resultFunction;
    };
} else {
    bind = function(boundThis) {
        var fn = this;
        var args1 = Array.prototype.slice.call(arguments, 1);
        var resultFunction = function() {
            var args2 = Array.prototype.slice.call(arguments, 0);
            return fn.apply(
                this instanceof resultFunction ? this : boundThis,
                args1.concat(args2));
        };
        resultFunction.prototype = fn.prototype;
        return resultFunction;
    };
}

module.exports = bind;