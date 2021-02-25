const { SyncHook } = require("./tapable");

const hook = new SyncHook(["name"]);
hook.tap("name", function (name) {
    console.log(name, "name1")
})
hook.tap("name", function (name) {
    console.log(name, "name2")
})
hook.call("aa")