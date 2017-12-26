var path = require('path');
var webpack = require('webpack');

module.exports = {
    devtool: 'source-map',

    entry: {
        bundle: 'app',
        vendor:['react','react-dom','react-router'],

    },

    entry: [
        path.resolve(__dirname, './entrys/insurance/index.js')

    ],



    output: {
            path: path.resolve(__dirname, 'build'),
            filename: 'bundle.js'
        },
        resolve: {
            extensions: ['', '.js', '.jsx']
        },
        devServer: {
            contentBase: "./build",
            stats:{colors: true},
            historyApiFallback: true,
            inline: true,
            port:3000,
            hot:true,

            proxy:{
                '/insurancems/*':{
                    target: 'http://localhost:8080/',
                    secure: false,
                    changeOrigin: true
                }
            }
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new webpack.optimize.CommonsChunkPlugin('vendor',  'vendor.js'),
            new webpack.DefinePlugin({
                "process.env": {
                    'NODE_ENV': JSON.stringify("production")
                }
            }),
            new webpack.optimize.UglifyJsPlugin({
                mangle: {
                    except: ['$super', '$', 'exports', 'require']
                    //以上变量‘$super’, ‘$’, ‘exports’ or ‘require’，不会被混淆
                },
                compress: {
                    warnings: false
                },
                output: {
                    comments: false,  // remove all comments
                },
            }),


        ],

        module: {
        loaders: [
                {
                    test: /(\.jsx|\.js)$/,
                    loader: 'babel?presets[]=es2015&presets[]=react&presets[]=stage-0',
                    exclude: /node_modules/
                },
                { test: /\.css$/, loader: "style!css" },
                {
                    test: /\.json$/,
                    loader: 'json',
                },
                {
                    test: /\.(jpe?g|png|gif|svg)$/,
                    loader: 'url?limit=8024&name=images/[name].[ext]'
                },
                {
                    test: /\.(woff2?|otf|eot|svg|ttf)$/i,
                    loader: 'url?name=fonts/[name].[ext]'
                },
                {
                    test: /\.html$/,
                    loader: 'url?name=[name].[ext]'
                },
                {
                    test: /\.(mp4)$/,
                    loader: 'file'
                },
            ]
    }
};