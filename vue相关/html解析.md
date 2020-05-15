### html解析流程

    当vue完成初始化工作并对数据进行侦测后，会进行挂载，挂载过程如果无render函数，会对进行html模板解析过程，
    解析的目的是将文件中的模板，先转换为抽象语法树ast，再将ast转为固定模式的字符串，然后通过new Function 和 with将特殊模式的字符串转成render并赋值到vm.$options中

### 获取template模板
    ```
    // ./init.js文件
    Vue.prototype.$mount = function(el){
        const vm = this
        const options = vm.$options
        let template = options.template
        // 编译的三个条件1.render函数 2. el 3. tmeplate模板
        // render函数不存在说明要编译模板， 如果存在render函数不需处理
        if(!options.render) {
            // 如果不能存在template说明是在dom结构中写的， 那就需要获取el的结构
            if(!template && el) {
                template = document.querySelector(el).outerHTML
            } else {
                // 如果模板template存在，可能存在两种方式1.options里写的字符串 2. script标签写的模板(为id选择器)
                // 只需对id选择器情况处理即可
                if(~template.indexOf('#')) {
                    template = document.querySelector(template).innerHTML
                }
            }
        }
        
    }
    ```
    在挂载方法$mount中，我们需要进行条件判断处理， 1. 是否有render函数， 如果有render函数不需要进行模板解析，直接使用用户提供的render函数生成vnode， 2.用户未提供render函数，如果在options中无template，并且用户提供了el，说明是在html的dom中写的结构， 需要获取当前el的outerHTML 3. 用户未提供render函数，并且options中存在template，可能有两种情况，一种是template为id选择器，另一种template就是字符串描述的dom结构，当template为id选择器时是用script标签模板写的dom结构， 需要用innerHTML获取script内的文本内容，template为字符串不需要处理

### 解析html字符串
    以下为从源码中直接复制的正则，用来匹配标签中的内容
    const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;  
    const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
    const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
    const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
    const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的
    const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >
    export const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g
    
    startTagOpen用于匹配开始标签，startTagClose用于匹配开始标签的结束尖角号，attribute用于匹配标签上的各种属性，endTag用于匹配结束标签 defaultTagRE用于匹配{{}}中的内容


    ```
    // ./init.js文件
    Vue.prototype.$mount = function(el){
        .................
        if(!options.render) {
            ...................
            // 将template转换为render函数
            const render = compileToFunction(template)
            options.render = render
        }
        
    }
    ```
    在$mount中调用compileToFunction函数生成render函数并赋值到options选项， 在compileToFunction去处理和解析html流程和生成render函数的过程，以下为函数文件位置

    ```
    // ./compiler/index.js文件
    export function compileToFunction(template) {
        // 生成ast语法树
        const root = parseHTML(template) 
    }
     // ./compiler/parse-html.js文件
    export function parseHTML(template) {
        let html = template
        while(html) {
            <!-- 解析html，解析完一部分，就会将匹配解析完成的截取掉， 直到html为空字符串 -->
        ｝
    }
    ```

    对于html字符串，会进行逐步解析， 首先会查看<号的位置，因为开始标签和结束标签的第一位都是尖角号，如果0位为尖角号的，说明是标签， 就需要处理开始和结束标签

    ```
    // ./compiler/parse-html.js文件
    export function parseHTML(template) {
        let html = template
        while(html) {
            // 获取尖角号的位置
            let endIndex = html.indexOf('<')
            // 如果等于0 说明是标签开始或结束的地方
            if(endIndex == 0) {
                // 匹配开始标签
                const startMatch = parseStartTag()
                // 匹配到结果， 转为ast
                if(startMatch) {
                    ........
                }
                // 匹配到结束，
                let endMatch;
                if(endMatch = html.match(endTag)) {
                    ........
                }
            }
        ｝
        function parseStartTag() {
            // 匹配开始标签
            const start = html.match(startTagOpen)
        }
    }

    ```
