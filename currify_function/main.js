const currify = (fn, params = [])=>
    (...args) =>
         params.length + args.length=== fn.length
             ? fn(...params, ...args)
             : currify(fn, [...params, ...args]);

addTwo = (a,b)=>a+b
addThree = (a,b,c)=>a+b+c

newAddTwo = currify(addTwo)
newAddThree = currify(addThree)

console.log(newAddTwo(1)(2)) // 3
console.log(newAddThree(1)(2)(3)) // 6
