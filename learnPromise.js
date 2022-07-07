// 创建一个promise实例
// const prom = new Promise(function (resolve, reject) {
//   // code
//   if (/*异步操作成功*/) {
//     resolve(value)
//   } else {
//     reject(err)
//   }
// })
// prom.then(function (value) {
//   // resolved状态的回调---可选的函数，参数值为resolve函数传递的参数
// }, function (err) {
//   // rejected状态的回调---可选的函数，参数值为reject函数传递的参数
// })

// 示例1：pending->fulfilled之后，就会触发then中的回调函数
// function timeout (ms) {
//   return new Promise(function (resolve, reject) {
//     setTimeout(resolve, ms, 'done')
//   })
// }
// timeout(100).then((val) => {
//   console.log(val)
// })

// 示例2：Promise创建后会立即执行
// const prom = new Promise(function (resolve, reject) {
//   console.log('Promise content')
//   resolve()
// })
// prom.then(() => {
//   console.log('resolved')
// })
// console.log('Hi')

// 输出
// Promise
// Hi!
// resolved
// 1、因为Promise新建后立即执行，所以首先输出Promise
// 2、then方法指定的回调函数将在当前脚本所有同步代码执行完成才会执行
// 因此，resolved最后输出

// 示例3：异步加载图片
// function loadImgAsync (url) {
//   return new Promise(function (resolve, reject) {
//     const img = new Image()
//     img.onload = function () {
//       resolve(img)
//     }
//     img.onerror = function () {
//       reject(new Error('Could not load image at ' + url))
//     }
//     img.src = url
//   })
// }

// 示例4：使用Promise实现ajax操作
// const getJson = function (url) {
//   return new Promise(function (resolve, reject) {
//     const handler = function () {
//       if (this.readyState !== 4) {
//         return
//       }
//       if (this.status === 200) {
//         resolve(this.response)
//       } else {
//         reject(new Error(this.statusText))
//       }
//     }
//     const client = new XMLHttpRequest()
//     client.open('GET', url)
//     client.onreadystatechange = handler
//     client.responseType = 'json'
//     client.setRequestHeader('Accept', 'application/json')
//     client.send()
//   })
// }
// getJson('https://www.1958xy.com/player/getRefreshStatus?p=f872e28be31c4f4999fd2e1ad2ae01d3').then((json) => {
//   console.log('content is ' + json)
// }, (err) => {
//   console.log(err)
// })

// 示例5：将一个promise对象传递给另一个promise的resolve
// const p1 = new Promise(function (resolve, reject) {
//   setTimeout(() => {
//     reject(new Error('rejected'))
//   }, 3000)
// })
// const p2 = new Promise(function (resolve, reject) {
//   setTimeout(() => {
//     resolve(p1)
//   }, 1000)
// })
// p2.then(result => console.log('result----' + result))
//   .catch(err => console.log('err----' + err))

// 输出：err----Error: rejected
// 分析：当p2将p1作为参数时，p2的状态将由p1的状态决定，因为
// p1最终状态为rejected，所以p2最终状态也是rejected，
// 因此触发catch方法指定的回调

// 示例6：调用resolve或者reject不会终止Promise的参数函数中代码的执行
// new Promise(function (resolve, reject) {
//   resolve(1)
//   console.log(2)
// }).then(val => console.log(val))

// 输出： 2， 1
// 这是因为立即 resolved 的 Promise 是在本轮事件循环的末尾执行，
// 总是晚于本轮循环的同步任务。

// 示例7：一般将后续操作放到then指定的回调中，
// 而不是放在resolve或者reject调用后面，
// 为防止后续代码执行，可以在resolve或者reject之前加上return
// new Promise(function (resolve, reject) {
//   return resolve(1)
//   console.log(2)
// }).then(val => console.log(val))

// Promise.prototype.then()
// 1. then方法在Promise.prototype上，因此Promise的实例具有then方法
// 2. then方法第一个参数是resolved状态(即fulfilled状态)的回调函数，第二个参数是rejected状态的回调函数，它们都是可选的
// 3. then方法返回一个新的Promise实例（不是原来的）
// 4. 可以链式调用，链式调用时，then的两个回调只有一个被调用，因为只能达到其中一种状态
// 而这两个回调中执行的那一个的函数返回值会传递给下一个then中的回调，至于是传递给下一个then回调
// 中的哪一个，取决于当前then返回的promise的状态
// new Promise(function (resolve, reject) {
//   resolve('aliao')
// }).then(val => {
//   return 'xingzai'
// }).then(val => {
//   console.log(val)
// }).then(val => {
//   console.log(val)
// })
// 输出
// xingzai
// undefined

// 示例8：
// getJson('/post').then((post) => {
//   return getJson(post.url)
// }).then(
//   val => console.log('resolved----', val),
//   err => console.log('rejected----', err)
// )
// 第一个then指定的回调返回了一个promise实例
// 此时，第二个then就等待这个返回的promise实例的状态变化
// 如果为resolved，就执行第一个回调，如果为rejected就执行第二个回调

// Promise.prototype.catch()
// 1. Promise.prototype.catch()是.then(null, rejection)或者.then(undefined, rejection)的别名
// 示例：1
p.then((val) => console.log('fulfilled:', val))
  .catch((err) => console.log('rejected', err))
// 等同于
p.then((val) => console.log('fulfilled:', val))
  .then(null, (err) => console.log("rejected:", err))

getJson('/post').then(val => {
  console.log(val)
}).catch(err => {
  console.log(err)
})
// getJSON()方法返回一个 Promise 对象，
// 1. 如果该对象状态变为resolved，则会调用then()方法指定的回调函数；
// 2. 如果异步操作抛出错误，状态就会变为rejected，就会调用catch()方法指定的回调函数，处理这个错误。另外，then()方法指定的回调函数，
// 3. 如果运行中抛出错误，也会被catch()方法捕获。

// 示例：2
// 写法一
const promise = new Promise(function (resolve, reject) {
  throw new Error('test')
})
promise.catch(function (error) {
  console.log(error)
})

// 写法二
const promise = new Promise(function (resolve, reject) {
  try {
    throw new Error('test');
  } catch (e) {
    reject(e)
  }
})
promise.catch(function (error) {
  console.log(error)
})
// 写法三
const promise = new Promise(function (resolve, reject) {
  reject(new Error('test'))
})
promise.catch(function (error) {
  console.log(error)
})
// 输出：Error: test
// 这三种写法等价，比较上面几种写法，可以发现reject()方法的作用，等同于抛出错误

// 示例3：
const promise = new Promise(function (resolve, reject) {
  resolve('ok');
  throw new Error('test'); // 此代码会被执行，但不会被捕获
});
promise
  .then(function (value) { console.log(value) })
  .catch(function (error) { console.log(error) });
// 输出：ok
// 解析：当resolve之后，状态改变为fulfilled，此时状态就会固定，不会再改变了
// 因此，在resolve后面抛出错误，不会被捕获，等同于没有抛出

// 示例4
getJSON('/post/1.json').then(function (post) {
  return getJSON(post.commentURL);
}).then(function (comments) {
  // some code
}).catch(function (error) {
  // 处理前面三个Promise产生的错误
});
// Promise对象的错误具有冒泡性质，会一直向后传递，直到捕获为止。
// 