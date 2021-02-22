const fs = require("fs");
const path = require("path");
const { parse } = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");
const genarator = require("@babel/generator").default;
const ejs = require("ejs");
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
                        paths.node.callee.name = "__webpack__require";
                        let moduleName = paths.node.arguments[0].value;
                        moduleName = path.extname(moduleName) ? moduleName : moduleName + ".js"
                        moduleName = "./" + path.join(parentPath, moduleName);
                        dependencies.push(moduleName);
                        paths.node.arguments = [t.stringLiteral(moduleName)];
                    }
                }
            },
        })
        const sourceCode = genarator(ast);
        return { sourceCode, dependencies }
    }
    emitFile () {
        // 获取到模板内容
        const content = this.getContent(path.resolve(__dirname, './temp.ejs'));
        const main = path.resolve(this.config.output, this.config.filename);
        const code = ejs.render(content, { entryId: this.entryId, modules: this.modules });
        this.assets = {};
        this.assets[main] = code;
        fs.writeFileSync(main)
    }
    run () {
        // 解析模块
        this.buildModule(path.join(this.root, this.entry), true);
        this.emitFile();
    }
}
module.exports = Compiler