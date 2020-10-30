
// const Promise = require('./promise.js')
const promise = new Promise((resolve, reject) => {
  // throw new Error("2222");
  resolve("1111");
  // reject(2222)
})

promise.then((res) => {
  return promise
  // throw new Error("sjfhdk")
  // return new Promise((resolve, rject) => {
  //   setTimeout(() => {
  //     // resolve(999999)
  //   }, 1000)
  // })
}, (err) => {
  console.log(err, "2err------------")
})
promise.then((res) => {
  console.log(res, "2-------------------")
}, (err) => {
  console.log(err, "2err------------")
})