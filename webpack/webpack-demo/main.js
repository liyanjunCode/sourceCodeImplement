(function (modules) { // webpackBootstrap
var installedModules = {};
function __webpack_require__ (moduleId) {
if (installedModules[moduleId]) {
return installedModules[moduleId].exports;
}
var module = installedModules[moduleId] = {
i: moduleId,
l: false,
exports: {}
};
modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
module.l = true;
return module.exports;
}
return __webpack_require__(__webpack_require__.s = "./src\main.js");
})
({

"./src\main.js":(function (module, __webpack_exports__, __webpack_require__) {

"use strict";
eval(`const b = __webpack_require__("./src\\b.js");

__webpack_require__("./src\\index.less");

console.log(b);`);
}),

"./src\b.js":(function (module, __webpack_exports__, __webpack_require__) {

"use strict";
eval(`const a = __webpack_require__("./src\\a.js");

const b = "wo shi b" + a;
module.exports = b;`);
}),

"./src\a.js":(function (module, __webpack_exports__, __webpack_require__) {

"use strict";
eval(`const a = "wo shi a";
module.exports = a;`);
}),

"./src\index.less":(function (module, __webpack_exports__, __webpack_require__) {

"use strict";
eval(`let style = document.createElement('style');
style.innerHTML = "body {\n  background: red;\n}\n";
document.head.appendChild(style);`);
}),

});