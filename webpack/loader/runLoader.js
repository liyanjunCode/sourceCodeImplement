
const path = require("path");
const fs = require("fs");
const readFile = fs.readFileSync;
let options = {
    resource: path.resolve(__dirname, "./src/title.js"),
    loaders: [
        path.resolve(__dirname, "./loaders/a-loader.js"),
        path.resolve(__dirname, "./loaders/b-loader.js"),
        path.resolve(__dirname, "./loaders/c-loader.js"),
    ]
}
// 需要将每一个loader转换对象形式
// 每一个对象中有
/* 
*  path  loader的绝对路径
*  data 用于在normalLoader和pitch中共享的数据
*  normal   代表normalloader
* pitch     代表pitchLoader
* return loaderObject
 */

function createLoader (path) {
    let loaderObject = { data: {} };
    loaderObject.path = path;
    loaderObject.normal = require(path);
    loaderObject.pitch = loaderObject.normal.pitch;
    return loaderObject;
}
function runLoader (options, finalCallBack) {
    // loader的上下文环境，loader执行时会将this指向此loaderContxt
    let loaderContxt = {};
    //打包的入口文件
    const resource = options.resource;
    let loaders = options.loaders;
    // 处理loaders， 进行转换
    loaders = loaders.map(createLoader);
    // 执行的loader序列，用于判断normal和pitch的执行
    loaderContxt.loaderIndex = 0;
    // 存入上下文打包入口路径
    loaderContxt.resource = resource;
    // 存入上下文读取文件内容方法
    loaderContxt.readFile = readFile;
    // loader对象存入上下文
    loaderContxt.loaders = loaders;
    Object.defineProperty(loaderContxt, "request", {
        get () {
            return loaderContxt.loaders.map(loader => loader.path)
                .concat(loaderContxt.resource).join("!");
        }
    })
    // 剩余未执行的loader
    Object.defineProperty(loaderContxt, "remainingRequest", {
        get () {
            return loaderContxt.loaders.slice(loaderContxt.loaderIndex + 1).map(loader => loader.path)
                .concat(loaderContxt.resource).join("!");
        }
    })
    // 已经执行的loader
    Object.defineProperty(loaderContxt, "previousRequest", {
        get () {
            return loaderContxt.loaders.slice(0, loaderContxt.loaderIndex).map(loader => loader.path).join("!");
        }
    })
    // 当前loader的data, 因为loader内可以用this.data获取
    Object.defineProperty(loaderContxt, "data", {
        get () {
            return loaderContxt.loaders[loaderContxt.loaderIndex].data;
        }
    })
    // 先执行pitch
    iteratePitchingLoaders(loaderContxt, finalCallBack);
    function iteratePitchingLoaders (loaderContxt, finalCallBack) {
        // 如果当前的loaderIndex已经大于或超出loader的length，就直接去读取文件源码
        if (loaderContxt.loaderIndex >= loaderContxt.loaders.length) {
            // 需要回到loader的最后一个
            loaderContxt.loaderIndex--;
            return processSource(loaderContxt, finalCallBack);
        }
        // 从loaders中取出当前loader 的pitch
        const currentLoaderObject = loaderContxt.loaders[loaderContxt.loaderIndex];
        const pitchFn = currentLoaderObject.pitch;
        let res;
        if (pitchFn && (res = pitchFn.call(loaderContxt, loaderContxt.remainingRequest, loaderContxt.previousRequest, loaderContxt.data))) {
            // 如果此loader定义了pitch就执行pitch函数

            // 如果有返回值，直接跳过剩下loader的pitch和source，和当前loader的normal，往回执行normalloader
            // if (res) {
            loaderContxt.loaderIndex--;
            return iterateNormalLoader(loaderContxt, res, finalCallBack);
            // } else {
            //     loaderContxt.loaderIndex++;
            //     iteratePitchingLoaders(loaderContxt, finalCallBack);
            // }
        } else {
            // 未定义loader就寻找下一个loader是否定义pitch函数
            loaderContxt.loaderIndex++;
            iteratePitchingLoaders(loaderContxt, finalCallBack);
        }

    }
    // 读取文件源码
    function processSource (loaderContxt, finalCallBack) {
        const source = loaderContxt.readFile(loaderContxt.resource);
        iterateNormalLoader(loaderContxt, source, finalCallBack);
    }
    // 源码转换内容格式
    function convertSource (source, raw) {
        if (raw && !Buffer.isBuffer(source)) {
            // 如果想要buffer类型，source不是buffer就需要转换
            source = new Buffer(source,)
        } else if (!raw && Buffer.isBuffer(source)) {
            // 如果是buffer想要字符串类型，转成字符串
            source = source.toString("utf8");
        }
        // 其他不处理直接返回
        return source;
    }
    // 根据pitch再决定需不需要执行normalLoader
    function iterateNormalLoader (loaderContxt, source, finalCallBack) {
        let result;
        // 如果loaders中的loader已经执行完， 执行finalCallBack
        if (loaderContxt.loaderIndex < 0) {
            return finalCallBack(null, source);
        }
        // 取出当前的loader
        const currentLoaderObject = loaderContxt.loaders[loaderContxt.loaderIndex];
        const normalFn = currentLoaderObject.normal;
        // 因为在loader函数中可以用raw设置内容是二进制还是字符串首先要判断当前的
        // loader是输出二进制聂荣还是字符串内容
        source = convertSource(source, normalFn.raw);
        runAsyncOrSyncLoader(normalFn, loaderContxt, source, finalCallBack);
    }
    function runAsyncOrSyncLoader (normalFn, loaderContxt, source, finalCallBack) {
        // 默认是同步执行
        let isSync = true;
        // 提供给使用者的函数
        const innerCallback = loaderContxt.callback = function (err, source) {
            // /执行完一个loader后就重置为同步执行
            iterateNormalLoader(loaderContxt, source, finalCallBack);
        }
        // 改变loader为异步获取结果， 并将继续执行下一个loader的控制权移交给用户
        loaderContxt.async = function () {
            isSync = false
            return innerCallback;
        }
        loaderContxt.loaderIndex--;
        // 不管同步异步获取结果都要执行loader
        let result = normalFn.call(loaderContxt, source,);
        // 如果是同步loader代码， 就继续调用iterateNormalLoader调用下一个loader
        if (isSync) {
            iterateNormalLoader(loaderContxt, result || source, finalCallBack);
        }
    }
}

runLoader(options, (err, result) => {
    console.log(result)
})