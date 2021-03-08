const postcss = require("postcss");
const Tokenizer = require("css-selector-tokenizer");
const loaderUtils = require("loader-utils");
// 
/* 
css-loader 要处理两点
1. 处理掉import语法， 用require引入文件
2.处理掉背景图的url 用require引入图片
3. postcss插件会将css规则转为抽象语法树
4.所有的插件会被集合到数组中传入postcss， 抽象语法树会作为参数传入插件中
*/
function loader (inputSource) {
    const transofrm = (postCssOptions) => {
        return (root) => {
            root.walkAtRules(/^import$/, rule => {
                // 匹配import规则， 并删除import， 将引入文件的路径加入到importUrls中，留到最后处理
                rule.remove();
                postCssOptions.importUrls.push(rule.params)
            })
            root.walkDecls(decl => {
                // 将decl.value转为对象
                let values = Tokenizer.parseValues(decl.value);
                values.nodes.forEach(nodeValue => {
                    nodeValue.nodes.forEach(item => {
                        if (item.type == "url") {
                            // 更改url为require图片引入方式
                            item.url = `require(${loaderUtils.stringifyRequest(this, item.url)}).default`
                        }
                    })
                })
                // 将对象再转为字符串 替换掉decl.value的值
                decl.value = Tokenizer.stringifyValues(values);
            })
        }
    }
    const postCssOptions = {
        importUrls: []
    }
    postcss([transofrm(postCssOptions)]).process(inputSource).then(result => {
        console.log(result.css, "result", postCssOptions.importUrls)
    })
    return inputSource;
}
module.exports = loader;