const fs = require("fs");
const path = require("path");
const { parse } = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");
const genarator = require("@babel/generator").default;
const ejs = require("ejs");
class Compiler {
    constructor(config) {
        this.entryId;
        this.modules = {};
        this.config = config;
        this.entry = config.entry;
        this.root = process.cwd();
    }
    getContent (module) {
        let content = fs.readFileSync(module, "utf-8");
        const rules = this.config.module.rules;
        for (let i = 0; i < this.config.module.rules.length; i++) {
            const { test, use } = rules[i];
            let len = use.length - 1;
            if (test.test(module)) {
                // loader 从后或右， 向左或上执行
                function normalLoader () {
                    const loader = require(use[len--]);
                    content = loader(content);
                    if (len >= 0) {
                        normalLoader();
                    }
                }
                normalLoader();
            }
        }
        return content;
    }
    buildModule (modulePath, isEntry) {
        const content = this.getContent(modulePath);
        const moduleName = "./" + path.relative(this.root, modulePath)
        if (isEntry) {
            this.entryId = moduleName;
        }
        const { sourceCode, dependencies } = this.parse(content, path.dirname(path.relative(this.root, modulePath)));
        this.modules[moduleName] = sourceCode;
        dependencies.forEach(dep => {
            this.buildModule(path.resolve(this.root, dep), false);
        })
    }
    parse (content, parentPath) {
        const dependencies = [];
        const ast = parse(content);
        traverse(ast, {
            enter (paths) {
                if (paths.node.type === "CallExpression") {
                    if (paths.node.callee.name === "require") {
                        paths.node.callee.name = "__webpack_require__";
                        let moduleName = paths.node.arguments[0].value;
                        moduleName = path.extname(moduleName) ? moduleName : moduleName + ".js"
                        moduleName = "./" + path.join(parentPath, moduleName);
                        dependencies.push(moduleName);
                        paths.node.arguments = [t.stringLiteral(moduleName)];
                    }
                }
            },
        })
        const sourceCode = genarator(ast).code;
        return { sourceCode, dependencies }
    }
    emitFile () {
        // 获取到模板内容
        const content = this.getContent(path.resolve(__dirname, './temp.ejs'));
        const main = path.resolve(this.config.output.path, this.config.output.filename);
        const code = ejs.render(content, { entryId: this.entryId, modules: this.modules });
        this.assets = {};
        this.assets[main] = code;
        fs.writeFileSync(this.config.output.filename, code, { encoding: "utf8" })
    }
    run () {
        // 解析模块
        this.buildModule(path.join(this.root, this.entry), true);
        this.emitFile();
    }
}
module.exports = Compiler