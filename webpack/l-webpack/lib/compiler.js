const fs = require("fs");
const path = require("path");
const { parse } = require("@babel/parser");
const { traverse } = require("@babel/traverse");
class Compiler {
    constructor(config) {
        this.entyId;
        this.modules = {};
        this.config = config;
        this.entry = config.entry;
        this.root = process.cwd();
    }
    getContent (module) {
        const content = fs.readFileSync(module, "utf-8");
        return content;
    }
    buildModule (modulePath, isEntry) {
        const content = this.getContent(modulePath);
        const moduleName = "./" + path.relative(this.root, modulePath)
        if (isEntry) {
            this.entyId = moduleName;
        }
        const { sourceCode, dependencies } = this.parse(content);
        this.modules[moduleName] = sourceCode;
    }
    parse (content) {
        const ast = parse(content);
        traverse(ast, {

        })
        return {}
    }
    emitFile () {

    }
    run () {
        // 解析模块
        this.buildModule(path.join(this.root, this.entry), true);
        this.emitFile();
    }
}
module.exports = Compiler