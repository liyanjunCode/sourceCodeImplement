class HookCodeFactory {
    setUp (context, options) {
        this.options = options;
        //向类上挂载回掉函数数组

        context._x = options.taps.map(tap => tap.fn)
    }
    create (options) {
        return new Function(
            this.args(),
            this.head() + this.content()
        )
    }
    args () {
        return this.options.args.join(",");
    }
    // 定义函数内的上下文和获取回掉函数数组
    head () {
        return (
            `
            var _context;
            var _x = this._x;
            `
        )
    }
    content () {
        let code = '';
        this.options.taps.forEach((fn, i) => {
            code += `
            var _fn${i} = _x[${i}];
            _fn${i}(${this.args()});
            `
        });
        return code;
    }
}

module.exports = HookCodeFactory;