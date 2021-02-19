// 同步钩子
class SyncHook {
    constructor(list) {
        this.hook = []
    }
    tap (name, callback) {
        this.hook.push(callback);
    }
    call (...args) {
        this.hook.forEach(callback => {
            callback(...args)
        })
    }
}
// 同步保险钩子
class SyncBailHook {
    constructor(list) {
        this.hooks = []
    }
    tap (name, callback) {
        this.hooks.push(callback);
    }
    call (...args) {
        let res;
        let index = 0;
        do {
            res = this.hooks[index++](...args);
        } while (index < this.hooks.length && res == undefined)
    }
}
// 同步瀑布钩子
class SyncWaterfallHook {
    constructor(list) {
        this.hooks = []
    }
    tap (name, callback) {
        this.hooks.push(callback);
    }
    call (...args) {
        const [first, ...others] = this.hooks;
        const result = first(...args);
        others.reduce((res, curCallback) => {
            return curCallback(res);
        }, result)
    }
}
// 同步多次执行钩子
class SyncLoopHook {
    constructor(list) {
        this.hooks = []
    }
    tap (name, callback) {
        this.hooks.push(callback);
    }
    call (...args) {
        let res;
        this.hooks.forEach(callback => {
            do {
                res = callback(...args);
            } while (res !== undefined)
        })

    }
}
// 异步并行钩子
class AsyncParallelHook {
    constructor(list) {
        this.hooks = [];
    }
    tapAsync (name, callback) {
        this.hooks.push(callback);
    }
    tapPromise (name, callback) {
        this.hooks.push(callback);
    }
    callAsync (...args) {
        const finalFunciton = args.pop();
        let index = 0;
        const next = () => {
            index++;
            if (index === this.hooks.length) { finalFunciton() };
        }
        this.hooks.forEach(callback => {
            callback(...args, next)
        })
    }
    promise (...args) {
        return new Promise((resolve, reject) => {
            let index = 0;
            const next = () => {
                index++;
                if (index === this.hooks.length) { resolve() }
            }
            this.hooks.forEach(callback => {
                callback(...args, next)
            })
        })
    }
}
// 异步串行钩子
class AsyncSerialHook {
    constructor(list) {
        this.hooks = [];
    }
    tapAsync (name, callback) {
        this.hooks.push(callback);
    }
    tapPromise (name, callback) {
        this.hooks.push(callback);
    }
    callAsync (...args) {
        const finalFunciton = args.pop();
        let index = 0;
        const next = () => {
            if (index === this.hooks.length) { return finalFunciton() };
            const callBack = this.hooks[index++];
            callBack(...args, next);
        }
        next();
    }
    promise (...args) {
        return new Promise((resolve, reject) => {
            const [firstCallback, ...argsCallback] = this.hooks;
            argsCallback.reduce((p, n, index) => {
                if (index == argsCallback.length - 1) { resolve() }
                return p.then(() => n(...args));
            }, firstCallback(...args))
        })
    }
}
module.exports = {
    SyncHook,
    SyncBailHook,
    SyncWaterfallHook,
    SyncLoopHook,
    AsyncParallelHook,
    AsyncSerialHook
}