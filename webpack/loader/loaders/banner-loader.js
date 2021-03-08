// 负责将版权声明等内容加到编译的代码中
// 可以在webpac.config.js中配置options声明
// 也可以单独建立文声明
const loaderUtils = require("loader-utils");
const { validate } = require("schema-utils");
const fs = require("fs");
function loader (inputSource) {
    const callback = this.async();
    const options = loaderUtils.getOptions(this);
    // 验证loader配置的options格式是否正确
    const schema = {
        type: "object",
        properties: {
            text: {
                type: "string"
            },
            filename: {
                type: "string"
            }
        }
    }
    validate(schema, options);
    const { text, filename } = options;
    if (text) {
        callback(null, text + inputSource)
    } else {
        fs.readFile(filename, { encoding: "utf8" }, (err, data) => {
            callback(null, data + inputSource)
        })
    }
}
module.exports = loader;