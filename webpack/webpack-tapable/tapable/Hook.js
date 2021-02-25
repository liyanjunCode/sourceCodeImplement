
class Hook {
    constructor(args) {
        if (!Array.isArray(args)) {
            args = [];
        }
        this._args = args;
        this._taps = [];
        this._x = undefined;
    }
    tap (options, fn) {
        if (typeof options === "string") {
            options = { name: options }
        }
        options.fn = fn;
        this._insert(options)
    }
    _insert (item) {
        this._taps.push(item);
    }
    call (...args) {
        console.log(this, "this")
        const method = this._createCall();
        // method是compiler编译后的函数
        method.call(this, args)
    }
    _createCall () {
        console.log(this, "this")
        // 因为complier，定义在子类， 所以需要用call转移this指向
        return this.compiler({
            taps: this.taps,
            args: this.args
        })
    }
}

module.exports = Hook;