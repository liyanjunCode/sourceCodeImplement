
const Promise = require('./promise.js')
// const promise = new Promise((resolve, reject) => {
//   reject("1111");
// })
// Promise.resolve(1111).then((res) => {
//   console.log(res, "”成功")
// }).catch(e => {
//   console.log(e, "失败")
// })
// promise.then((res) => {
//   // return promise
//   // return new Error("sjfhdk")
//   return new Promise((resolve, rject) => {
//     resolve(new Promise((resolve, reject) => {
//       setTimeout(() => {
//         resolve(new Promise((resolve, reject) => {
//           setTimeout(() => {
//             reject('hello')
//           }, 5000);
//         }))
//       }, 1000)
//     }))
//   })
// }, (err) => {
//   console.log(err, "第一次失败")
// }).then((res) => {
//   console.log(res, "第二次成功")
// }, (err) => {
//   console.log(err, "第二次失败")
// })
// promise.then().then().then((res) => {
//   console.log(res, "成功")
// }, e => {
//   console.log(e, "失败")
// })

// promise.then((res) => {
//   throw "222334"
// }).catch((e) => {
//   console.log(e, "失败")
// })
// Promise.race([function () { return 11112344 }, new Promise((resolve, reject) => {
//   setTimeout(() => {
//     resolve(22222)
//   }, 1000);
// }), { a: 1 }, "1111"]).then(res => {
//   console.log(res, "1111----")
// })
Promise.race([new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(22222)
  }, 1000);
}), new Promise((resolve, reject) => {
  reject("500失败")
})]).then(res => {
  console.log(res, "1111----")
})