const Hook = require("./Hook.js");
const HookCodeFactory = require("./HookCodeFactory.js");
const factory = new HookCodeFactory();
class SyncHook extends Hook {
    constructor(args) {
        super();
        this._args = args;
    }
    compiler (options) {
        factory.setUp(this, options);
        return factory.create(options);
    }

}
module.exports = SyncHook;