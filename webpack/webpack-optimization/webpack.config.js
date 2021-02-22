const path = require("path");
const webpack = require("webpack");
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
module.exports = {
    mode: 'production',
    entry: {
        index: "./src/index.js",
        main: "./src/main.js"
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "./dist")
    },
    module: {
        // noParse: /jquery/,
        // rules: [
        //     {
        //         test: /\.js$/,
        //         use: "babel-loader"
        //         // use: "happypack/loader?id=babel"
        //     }
        // ]
    },
    // plugins: [
    //     // new HardSourceWebpackPlugin()
    // ],
    optimization: {
        splitChunks: {
            chunks: "all",
            cacheGroups: {
                "common": {
                    chunks: "initial",
                    minSize: 0,
                    minChunks: 2
                },
                "vendor": {
                    chunks: "initial",
                    test: /node_moudles/,
                    priority: 1,
                    minChunks: 2,
                    minSize: 0
                }
            }
        }

    }

}