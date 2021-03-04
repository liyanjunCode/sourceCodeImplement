const path = require("path");
module.exports = {
    mode: "development",
    entry: "./index.js",
    output: {
        filename: "index.js",
        path: path.resolve(__dirname, "./dist")
    },
    resolveLoader: {
        modules: ["node_modules", path.resolve(__dirname, "./loaders")]
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    "loader1",
                    "loader2",
                    "loader3",
                ]
            }
        ]
    }
}