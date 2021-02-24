const path = require("path");
function Myplugin () {
    return {
        apply () {
            console.log("开始执行apply")
        }
    }
}
module.exports = {
    entry: "./src/main.js",
    output: {
        filename: "main.js",
        path: "./dist"
    },
    module: {
        rules: [
            // {
            //     test: /\.js$/,
            //     use: "babel-laoder"
            // },
            {
                test: /\.less$/,
                use: [
                    path.resolve(__dirname, "loader", "./style-loader"),
                    path.resolve(__dirname, "loader", "./less-loader")
                ]
            }
        ]
    },
    plugins: [
        // new Myplugin()
    ]
}