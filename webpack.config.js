var path = require('path');
var config = require('./app/config.js');
var autoprefixer = require('autoprefixer');
var webpack = require('webpack');

module.exports = {
    devtool: 'inline-source-map',
    entry: [
        'webpack-dev-server/client?http://127.0.0.1:8080/',
        'webpack/hot/only-dev-server',
        './app/client.jsx'
    ],
    output: {
        path: path.join(__dirname, 'public'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    resolve: {
        modulesDirectories: ['node_modules', 'app'],
        extensions: ['', '.js', '.jsx', '.scss']
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loaders: [
                    'react-hot',
                    'babel?presets[]=es2015&presets[]=react&presets[]=stage-1&plugins[]=transform-decorators-legacy&compact=true'
                ]
            },
            {
                test: /\.scss$/,
                loaders: [
                    'style',
                    'css',
                    'postcss',
                    'sass?outputStyle=expanded'
                ]
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: [
                    'url?limit=10000',
                    'img'
                ]
            },
            {
              test: /\.(woff|woff2)$/,
              loader: "url?prefix=fonts/&limit=10000"
            },
            {
              test: /\.ttf$/,
              loader: "url?prefix=fonts/&limit=10000"
            },
            {
              test: /\.eot$/,
              loader: "url?prefix=fonts/&limit=10000"
            },
            {
              test: /\.json$/,
              loader: "json-loader"
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ],
    postcss: [ autoprefixer({ browsers: ['last 3 versions'] }) ],
    devServer: {
        hot: true,
        proxy: {
            '*': 'http://127.0.0.1:' + config.HTTP_PORT
        },
        host: '127.0.0.1'
    }
};
