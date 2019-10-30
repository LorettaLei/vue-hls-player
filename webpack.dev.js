const HTMLPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const config = {
    devtool: '#cheap-module-eval-source-map',
    entry: "./src/index.js",
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },{
                test: /\.css$/,
                use: ['style-loader','css-loader'] 
            },{
                test: /\.scss$/,
                use: ['style-loader','css-loader','sass-loader']
                
            },{
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                },
                exclude: /node_modules/
            },{
                test: /\.(gif|jpg|jpeg|png)$/,
                use: [{
                    loader: 'url-loader', //把图片转base64  直接写在js里面  减少http请求
                    options: {
                        limit: 10240,
                        name: 'images/[name].[ext]'
                    }
                }]
            }
        ]
    },
    devServer: {
        port: 9000,
        host: '0.0.0.0',
        overlay: {
            errors: true
        },
        open: true,
        hot: true,
        compress: true
    },
    plugins: [
        new VueLoaderPlugin(),
        new HTMLPlugin({
            filename: './index.html',
            template: './src/index.html',
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true,
                minifyCSS: true
            },
            chunksSortMode: 'dependency'
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ]
}
module.exports = config
