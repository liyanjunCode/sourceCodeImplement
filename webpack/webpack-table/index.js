const { AsyncSerialHook, AsyncParallelHook, AsyncSerialBailHook } = require("./tapable");

/* 
    synchook
 */
// class Lesson {
//     constructor() {
//         this.hook = {
//             sync: new SyncHook()
//         }
//     }
//     tap () {
//         this.hook.sync.tap("name", function (name) {
//             console.log("hook1", name);
//         })
//         this.hook.sync.tap("name", function (name) {
//             console.log("hook2", name);
//         })
//     }
//     start () {
//         this.hook.sync.call("webpack")
//     }
// }
/* 
    SyncBailHook,

*/
// class Lesson {
//     constructor() {
//         this.hook = {
//             sync: new SyncBailHook()
//         }
//     }
//     tap () {
//         this.hook.sync.tap("name", function (name) {
//             console.log("hook1", name);
//             return true
//         })
//         this.hook.sync.tap("name", function (name) {
//             console.log("hook2", name);
//         })
//     }
//     start () {
//         this.hook.sync.call("webpack")
//     }
// }

/* 
    SyncWaterfallHook,
*/
// class Lesson {
//     constructor() {
//         this.hook = {
//             sync: new SyncWaterfallHook()
//         }
//     }
//     tap () {
//         this.hook.sync.tap("name", function (name) {
//             console.log("hook1", name);
//             return "name1"
//         })
//         this.hook.sync.tap("name", function (name) {
//             console.log("hook2", name);
//             return "name2"
//         })
//         this.hook.sync.tap("name", function (name) {
//             console.log("hook3", name);
//             return "name3"
//         })
//     }
//     start () {
//         this.hook.sync.call("webpack")
//     }
// }
/* 
    SyncLoopHook
*/
// class Lesson {
//     constructor() {
//         this.hook = {
//             sync: new SyncLoopHook()
//         }
//         this.index = 0;
//     }
//     tap () {
//         this.hook.sync.tap("name", (name) => {
//             console.log("hook1", name);
//             return ++this.index === 3 ? undefined : "继续"
//         })
//         this.hook.sync.tap("name", (name) => {
//             console.log("hook2", name);
//         })
//         this.hook.sync.tap("name", (name) => {
//             console.log("hook3", name);
//         })
//     }
//     start () {
//         this.hook.sync.call("webpack")
//     }
// }

/* 
    AsyncParallelHook 普通版
*/
// class Lesson {
//     constructor() {
//         this.hook = {
//             sync: new AsyncParallelHook()
//         }
//     }
//     tap () {
//         this.hook.sync.tapAsync("name", (name, cb) => {
//             setTimeout(() => {
//                 console.log("node", name);
//                 cb()
//             }, 1000)
//         })
//         this.hook.sync.tapAsync("name", (name, cb) => {
//             setTimeout(() => {
//                 console.log("react", name);
//                 cb()
//             }, 500)
//         })
//     }
//     start () {
//         this.hook.sync.callAsync("webpack", function () {
//             console.log("执行完了end")
//         })
//     }
// }
/* 
    AsyncParallelHook promise版
*/
// class Lesson {
//     constructor() {
//         this.hook = {
//             sync: new AsyncParallelHook()
//         }
//     }
//     tap () {
//         this.hook.sync.tapPromise("name", (name) => {
//             return new Promise((resolve, reject) => {
//                 setTimeout(() => {
//                     console.log("node", name);
//                     resolve()
//                 }, 1000)
//             })
//         })
//         this.hook.sync.tapPromise("name", (name) => {
//             return new Promise((resolve, reject) => {
//                 setTimeout(() => {
//                     console.log("react", name);
//                     resolve()
//                 }, 500)
//             })
//         })
//     }
//     start () {
//         this.hook.sync.promise("webpack").then(function () {
//             console.log("执行完了end")
//         })
//     }
// }
/* 
AsyncSerialHook 普通版
*/
// class Lesson {
//     constructor() {
//         this.hook = {
//             sync: new AsyncSerialHook()
//         }
//     }
//     tap () {
//         this.hook.sync.tapAsync("name", (name, cb) => {
//             setTimeout(() => {
//                 console.log("node", name);
//                 cb()
//             }, 1000)
//         })
//         this.hook.sync.tapAsync("name", (name, cb) => {
//             setTimeout(() => {
//                 console.log("react", name);
//                 cb()
//             }, 500)
//         })
//     }
//     start () {
//         this.hook.sync.callAsync("webpack", function () {
//             console.log("执行完了end")
//         })
//     }
// }
/* 
AsyncSerialHook promise版
*/
// class Lesson {
//     constructor() {
//         this.hook = {
//             sync: new AsyncSerialHook()
//         }
//     }
//     tap () {
//         this.hook.sync.tapPromise("name", (name) => {
//             return new Promise((resolve, reject) => {
//                 setTimeout(() => {
//                     console.log("node", name);
//                     resolve()
//                 }, 1000)
//             })
//         })
//         this.hook.sync.tapPromise("name", (name) => {
//             return new Promise((resolve, reject) => {
//                 setTimeout(() => {
//                     console.log("react", name);
//                     resolve()
//                 }, 500)
//             })
//         })
//     }
//     start () {
//         this.hook.sync.promise("webpack").then(function () {
//             console.log("执行完了end")
//         })
//     }
// }
/* 
AsyncSerialBailHook 普通版
*/
// class Lesson {
//     constructor() {
//         this.hook = {
//             sync: new AsyncSerialBailHook()
//         }
//     }
//     tap () {
//         this.hook.sync.tapAsync("name", (data, cb) => {
//             setTimeout(() => {
//                 console.log("node", data);
//                 cb(null, "课程1")
//             }, 1000)
//         })
//         this.hook.sync.tapAsync("name", (data, cb) => {
//             setTimeout(() => {
//                 console.log("react", data);
//                 cb(null, "课程2")
//             }, 500)
//         })
//     }
//     start () {
//         this.hook.sync.callAsync("webpack", function (data) {
//             console.log("执行完了end", data)
//         })
//     }
// }
/* 
AsyncSerialBailHook promise版
*/
class Lesson {
    constructor() {
        this.hook = {
            sync: new AsyncSerialBailHook()
        }
    }
    tap () {
        this.hook.sync.tapPromise("name", (data) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.log("node", data);
                    resolve("task1")
                }, 1000)
            })
        })
        this.hook.sync.tapPromise("name", (data) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.log("react", data);
                    resolve("task2")
                }, 500)
            })
        })
    }
    start () {
        this.hook.sync.promise("webpack").then(function (data) {
            console.log("执行完了end", data)
        })
    }
}
const lesson = new Lesson()
lesson.tap();
lesson.start();