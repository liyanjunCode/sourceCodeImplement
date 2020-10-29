// 三种状态FULFILLED（成功态）、REJECTED（失败态）、PENDING（等待态）
const FULFILLED = "FULFILLED";
const REJECTED = "REJECTED";
const PENDING = "PENDING";
class Promise {
  constructor(execution) {
    console.log("myPromise")
    /* 
     1.promise状态改变厚不能再次被改变即 如果是FULFILLED 不能再变为REJECTED 或PENDING
      REJECTED状态也不能再改变为FULFILLED  或PENDING
      2.如果execution函数中抛出异常，直接走reject流程
    */
    // 存储promise执行状态相关
    this.status = PENDING;
    // 存储FULFILLED状态的数据
    this.value;
    // 存储REJECTED状态的原因
    this.reason;
    // 成功的函数列表
    this.fulfilledList = [];
    this.rejectedList = [];
    const resolve = (value) => {
      if (this.status === PENDING) {
        // 改变状态
        this.status = FULFILLED;
        this.value = value;
        this.fulfilledList.forEach(resolve => {
          resolve(this.value);
        })
      }
    }
    const reject = (reason) => {
      if (this.status === PENDING) {
        // 改变状态
        this.status = REJECTED;
        this.reason = reason;
        this.rejectedList.forEach(reject => {
          reject(this.reason);
        })
      }
    }
    // 立即执行函数execution 在promise实例化时立即执行
    try {
      execution(resolve, reject);
    } catch (err) {
      reject(err);
    }

  }
  then (resolve, reject) {
    // 如果是成功调用成功函数
    if (this.status === FULFILLED) {
      resolve(this.value);
    }
    // 如果失败走reject失败函数
    if (this.status === REJECTED) {
      reject(this.reason);
    }
    // 如果是PENDING状态， 需要将成功和失败的两个函数存储起来， 当状态改编后调用
    if (this.status === PENDING) {
      this.fulfilledList.push(resolve);
      this.rejectedList.push(reject);
    }
  }
}
module.exports = Promise;