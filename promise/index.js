
const Promise = require('./promise.js')
const promise = new Promise((resolve, reject) => {
  // throw new Error("2222");
  // resolve("1111");
  reject(2222)
})

promise.then((res) => {
  console.log(res, "-------------------")
}, (err) => {
  console.log(err, "------------")
})