
const FULFILLED = "FULFILLED";
const REJECTED = "REJECTED";
const PENDING = "PENDING";
const resolvePromise = (promise, x, resolve, reject) => {
  // if (x === promise) { reject("") }

  if ((typeof x === 'object' && x != null) || typeof x === "function") {
    // 如果是function 就是promise
    if (typeof x === "function") {
      let then = x.then;
      then.call(x);
    } else {
      // 不是promise就是异常了
      reject(x);
    }
  } else {
    // 不是对象， 不是function， 就是普通值， 直接i盗用resolve
    // 把x当作值传递出去
    resolve(x);
  }
}
class Promise {
  constructor(executor) {
    console.log("myPromise")
    /* 
      关于状态：三种状态FULFILLED（成功态）、REJECTED（失败态）、PENDING（等待态）
      1.promise状态改变厚不能再次被改变即 如果是FULFILLED 不能再变为REJECTED 或PENDING
        REJECTED状态也不能再改变为FULFILLED  或PENDING， FULFILLED会有一个value结果，
        REJECTED会有一个被拒绝的理由reason
        2.如果executor函数中抛出异常，直接走reject流程
      关于状态参考promiseA+规范2.1promise Staetes
    */
    // 存储promise执行状态相关
    this.status = PENDING;
    // 存储FULFILLED状态的数据
    this.value;
    // 存储REJECTED状态的原因
    this.reason;
    // 成功的函数列表
    this.onFulfiledCallbacks = [];
    this.onRejectedCallbacks = [];
    const resolve = (value) => {
      if (this.status === PENDING) {
        // 改变状态
        this.status = FULFILLED;
        this.value = value;
        this.onFulfiledCallbacks.forEach(fn => {
          fn();
        })
      }
    }
    const reject = (reason) => {
      if (this.status === PENDING) {
        // 改变状态
        this.status = REJECTED;
        this.reason = reason;
        this.onRejectedCallbacks.forEach(fn => {
          fn();
        })
      }
    }
    // 立即执行函数executor 在promise实例化时立即执行
    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }

  }
  /* 
    then方法:
    1. then方法包括参数，一个是成功的回掉onFulfiled， 一个是失败的回掉onRejected， 这两个参数是可选项
    2.onFulfiled必须在promise是成功态后调用参数是value， 只能被调用一次
    3.onRejected必须在promise是失败态后调用参数是reason， 只能被调用一次
    4. then方法必须返回的还是一个promise 供链式调用
    5.onFulfiled执行可以返回值， 被下一个then获取使用，值可以为普通值（不是promise，不是异常）、异常、promise
  */
  then (onFulfiled, onRejected) {
    // 返回promise供链式调用
    let promise2 = new Promise((resolve, reject) => {
      // 如果是成功调用成功函数
      if (this.status === FULFILLED) {

        // 处理 x的类型需要抽离公共方法
        /* 
          1.如果用户在then中返回的是promise2， 因为 promise2还没实例化完， 所以访问会不存在
          所以需要将resolvePromise放入微任务或宏任务异步执行
          2. 异步方法导致executor执行时的try catch无法捕捉到错误， 所以resolvePromise还需要嵌套错误捕捉
        */
        setTimeout(() => {
          try {
            // 获取用户返回的值， 传到下一个
            let x = onFulfiled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (err) {
            reject(err)
          }
        }, 0);
      }
      // 如果失败走reject失败函数
      if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (err) {
            reject(err)
          }
        }, 0);
      }
      // 如果是PENDING状态， 需要将成功和失败的两个函数存储起来， 当状态改编后调用
      if (this.status === PENDING) {
        this.onFulfiledCallbacks.push(() => {

          // 处理 x的类型需要抽离公共方法
          setTimeout(() => {
            try {
              let x = onFulfiled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (err) {
              reject(err)
            }
          }, 0);
        });
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            } catch (err) {
              reject(err)
            }
          }, 0);
        });
      }
    })
    return promise2;
  }
}
module.exports = Promise;