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
            // {
            //     test: /\.js$/,
            //     use: [
            //         "loader1",
            //         "loader2",
            //         "loader3",
            //     ]
            // },
            // {
            //     test: /\.js$/,
            //     use: [
            //         {
            //             loader: "normal-loader",

            //         }
            //     ],
            //     // enforce: "normal"
            // },
            // {
            //     test: /\.js$/,
            //     use: [
            //         {
            //             loader: "post-loader",

            //         }
            //     ],
            //     enforce: "post"
            // },
            // {
            //     test: /\.js$/,
            //     use: [
            //         {
            //             loader: "prev-loader",

            //         }
            //     ],
            //     enforce: "pre"
            // },
            // {
            //     test: /\.js$/,
            //     use: [
            //         {
            //             loader: "inline-loader",

            //         },
            //     ],
            //     enforce: "inline"
            // },
            // {
            //     test: /\.js$/,
            //     use: [
            //         {
            //             loader: "banner-loader",
            //             options: {

            //                 text: "/* 这是版权声明 */",
            //                 filename: path.resolve(__dirname, "./banner.js")
            //             }
            //         }

            //     ]
            // },
            // {
            //     test: /\.js$/,
            //     use: [
            //         {
            //             loader: "file-loader"
            //         }

            //     ]
            // },
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    "css-loader"
                ]
            },
        ],

    }
}