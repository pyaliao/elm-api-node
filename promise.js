// let p1 = Promise.all([Promise.resolve(), Promise.resolve()])
// p1.then(() => console.log('resolved'))
// console.log(p1)

// async function foo() {
//   console.log(2)
//   console.log(await Promise.resolve(8))
//   console.log(9)
// }
// async function bar() {
//   console.log(4)
//   console.log(await 6)
//   console.log(7)
// }
// console.log(1)
// foo()
// console.log(3)
// bar()
// console.log(5)

// function add1(x, y) {
//   arguments[1] = 10
//   console.log(arguments.length, arguments, x, y)
// }
// add1(12, 19)
// function add2(x, y) {
//   y = 10
//   console.log(arguments.length, arguments, x, y)
// }
// add2(12, 19)

// const arr = [1, 2, 3]
// arr.sort((a, b) => {
//   console.log(b, a)
//   return b - a
// })
// console.log(arr)

// const data = [
//   {
//     name: 'aliao',
//     age: 29
//   },
//   {
//     name: 'zuizi',
//     age: 32
//   },
//   {
//     name: 'baibai',
//     age: 22
//   }, 
// ]

// function compare(propertyName) {
//   return function (obj1, obj2) {
//     const val1 = obj1[propertyName]
//     const val2 = obj2[propertyName]
//     if (val1 < val2) {
//       return -1
//     } else if (val1 > val2) {
//       return 1
//     } else {
//       return 0
//     }
//   }
// }
// data.sort(compare('name'))
// console.log(data)

// function factorial(n) {
//   if (n <= 1) {
//     return 1
//   } else {
//     return n * arguments.callee(n - 1)
//   }
// }
// factorial(3)

// let factorial = (function f(n) {
//   if (n <= 1) {
//     return 1
//   } else {
//     return n * f(n - 1)
//   }
// })
// const fac = factorial
// factorial = null
// console.log(fac(3))

// function test () {
//   'use strict'
//   console.log(arguments.caller)
// }
// test.caller

// function fib(n) {
//   return fibRec(0, 1, n)
// }
// function fibRec(a, b, n) {
//   if (n === 1) {
//     return a
//   }
//   return fibRec(b, a+b, n - 1)
// }
// console.log(fib(5))

// function outer() {
//   const a = 10
//   function inner() {
//     console.log(a, this)
//   }
//   inner()
// }
// outer()

// function test() {
//   console.log(this)
//   const inner = () => {
//     console.log(this)
//   }
//   inner()
// }
// test()

// let person = {}
// Object.defineProperty(person, 'name', {
//   configurable: false,
//   value: 'aliao'
// })
// Object.defineProperty(person, 'name', {
//   configurable: true
// })
// Object.defineProperty(person, 'name', {
//   writable: true
// })
// person.name = 'li' 

// let book = {
//   year_: 2017,
//   edition: 1
// }
// Object.defineProperty(book, 'year', {
//   get() {
//     return this.year_
//   },
//   set(newValue) {
//     if (newValue > this.year_) {
//       this.year_ = newValue
//       this.edition = newValue - this.year_
//     }
//   }
// })
// delete book.year
// Object.defineProperty(book, 'year', {
//   configurable: true
// })
// for (const key in book) {
//   // if (Object.hasOwnProperty.call(book, key)) {
//     console.log(key)
//   // }
// }

// let book = {}
// Object.defineProperties(book, {
//   year_: {
//     value: 2017
//   },
//   edition: {
//     value: 1
//   },
//   year: {
//     get() {
//       return this.year_
//     },
//     set(newValue) {
//       if (newValue > this.year_) {
//         this.year_ = newValue
//         this.edition += newValue - this.year_
//       }
//     }
//   }
// })
// const year_Desc = Object.getOwnPropertyDescriptor(book, 'year_')
// const yearDesc = Object.getOwnPropertyDescriptor(book, 'year')
// console.log(year_Desc, yearDesc)

// let book = {}
// Object.defineProperties(book, {
//   year_: {
//     value: 2017
//   },
//   edition: {
//     value: 1
//   },
//   year: {
//     get() {
//       return this.year_
//     },
//     set(newValue) {
//       if (newValue > this.year_) {
//         this.year_ = newValue
//         this.edition += newValue - this.year_
//       }
//     }
//   }
// })
// const desc = Object.getOwnPropertyDescriptors(book)
// console.log(desc)
// book.edition = 12
// console.log(this.edition)

// const A = {
//   name: 'A',
//   sayHello: function () {
//     console.log(this)
//     var s = () => console.log(this.name)
//     return s//返回箭头函数s
//   }
// }
// const A = {
//   name: 'A',
//   sayHello: () => {
//     // sayHello定义时的上下文是全局作用域，因此this指向全局作用域的this（剪头函数）
//     console.log(this)
//     var s = () => console.log(this.name)
//     return s//返回箭头函数s
//   }
// }
// A.sayHello()

// function Person(name, age) {
//   this.name = name
//   this.age = age
//   this.sayName = function () {
//     return this.name
//   }
// }
// const p1 = new Person('aliao', 20)
// const p2 = new Person('baibai', 10)
// console.log(p1, p2)

const Person = function () { }
Person.prototype.name = 'aliao'
Person.prototype.age = 18
Person.prototype.sayName = function () {
  console.log(this.name)
}
const p1 = new Person()
const p2 = new Person()
const k1 = Symbol('k1')
p1[k1] = 'symbol'
p1.name = 'daezi'
// console.log(p1.name, p2.name)
console.log(Object.keys(p1), Object.values(p1), Object.entries(p1))