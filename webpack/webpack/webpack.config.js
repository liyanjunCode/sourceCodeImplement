const path = require("path");
const { IgnorePlugin } = require("webpack");
const webpack = require("webpack");
const happypack = require("happypack")
// const AutoDllPlugin = require('autodll-webpack-plugin');
// const HtmlWebpackPlugin = require("html-webpack-plugin");
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
module.exports = {
    mode: 'production',
    entry: {
        index: "./src/index.js"
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "./dist")
    },
    module: {
        noParse: /jquery/,
        rules: [
            {
                test: /\.js$/,
                use: "babel-loader"
                // use: "happypack/loader?id=babel"
            }
        ]
    },
    plugins: [
        new IgnorePlugin({
            resourceRegExp: /^\.\/locale/,
            contextRegExp: /moment$/
        }),
        // new webpack.DllReferencePlugin({
        //     context: __dirname,
        //     manifest: require("./mainifest.json")
        // }),
        // new happypack({
        //     id: "babel",
        //     threads: 1,
        //     loaders: ["babel-loader"]
        // }),
        new HardSourceWebpackPlugin()
        // new HtmlWebpackPlugin({
        //     template: "./index.html"
        // }),
        // new AutoDllPlugin({
        //     // 设为 true 就把 DLL bundles 插到 index.html 里
        //     inject: true,
        //     // 文件名称
        //     filename: '[name].dll.js',
        //     // AutoDllPlugin 的 context 必须和 package.json 的同级目录，要不然会链接失败
        //     context: path.resolve(__dirname, './'),
        //     // 入口文件
        //     entry: {
        //         react: [
        //             'react',
        //             'react-dom'
        //         ]
        //     }
        // })
    ],
    // optimization: {
    //     splitChunks: {
    //         cacheGroups: {
    //             "vendor": {
    //                 test: /node_modules/,
    //                 minChunks: 1
    //             }
    //         }

    //     }
    // }
}