const currify = (fn, params = [])=> // fn 是要被柯里化的函数；params 是之前每次调用时参数的集合，第一次为空
    (...args) =>
         params.length + args.length=== fn.length // 判断之前的参数个数 + 当前调用的参数个数是否等于 fn 的形参
             ? fn(...params, ...args)
             : currify(fn, [...params, ...args]); // 把 params 和 args 合并，继续执行，直到收集到的参数与形参相等

addTwo = (a,b)=>a+b
addThree = (a,b,c)=>a+b+c

newAddTwo = currify(addTwo)
newAddThree = currify(addThree)

console.log(newAddTwo(1)(2)) // 3
console.log(newAddThree(1)(2)(3)) // 6
