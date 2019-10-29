const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
console.log(process.env.NODE_ENV)
const isDev = process.env.NODE_ENV === 'development'
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const config = {
    devtool: '#source-map',
    entry: "./src/index.js",
    output: {
        filename: 'vue-player.min.js',
        path: path.join(__dirname, 'dist'),
        // publicPath: '/dist/',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
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
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: isDev ? '"development"' : '"production"'
            }
        }),
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
        new VueLoaderPlugin()
    ]
}

if (isDev) { //开发环境
    config.devtool = '#cheap-module-eval-source-map'
    config.devServer = {
        port: 9000,
        host: '0.0.0.0',
        overlay: {
            errors: true
        },
        open: true,
        hot: true,
        compress: true
    },
    config.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    )
} else {
    config.entry = './src/components/vue-aplayer/vue-aplayer.vue'
    config.externals = {
        'hls.js': {
          amd: 'hls.js',
          commonjs: 'hls.js',
          commonjs2: 'hls.js',
          root: 'Hls'
        },
        'vue':  {
          amd: 'vue',
          commonjs: 'vue',
          commonjs2: 'vue',
          root: 'Vue'
        },
      },
    config.plugins.push(
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'runtime'
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_debugger: true,
                // drop_console: true
            },
            sourceMap: true
        })
    )
}
module.exports = config
