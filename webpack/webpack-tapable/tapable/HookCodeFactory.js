class HookCodeFactory {
    setUp (context, options) {
        this.options = options;

    }
    create (options) {
        return new Function(
            `${options.args.join(", ")}`,
            `if(options.context){
                var context = {}
            }else {
                var context;
            }
            fn.apply(context, ...args)
            `
        )
    }
}

module.exports = HookCodeFactory;