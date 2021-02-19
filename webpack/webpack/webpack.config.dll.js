const path = require("path");
const webpack = require("webpack");
// const WebpackAssetsManifest = require('webpack-assets-manifest');
const AutoDllPlugin = require('autodll-webpack-plugin')
module.exports = {
    mode: "production",
    entry: {
        react: ['react', 'react-dom']
    },
    output: {
        filename: "[name]_dll.js",
        path: path.resolve(__dirname, "dll"),
        library: "[name]_dll_[hash]"
    },
    plugins: [
        new webpack.DllPlugin({
            name: "[name]_dll_[hash]",
            path: path.join(__dirname, "./", "mainifest.json")
        }),
        new WebpackAssetsManifest({
            output: path.resolve(__dirname, "assets-manifest.json")
        }),
    ]
}