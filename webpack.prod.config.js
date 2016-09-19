var path = require('path');
var autoprefixer = require('autoprefixer');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin"); // Independent CSS file

var extractSass = new ExtractTextPlugin('bundle-sass.css');

module.exports = {
    entry: './app/client.jsx',
    output: {
        path: path.join(__dirname, 'public'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    resolve: {
        modulesDirectories: ['node_modules', 'app'],
        extensions: ['', '.js', '.jsx', 'scss']
    },
    module: {
        loaders: [
            // COMPONENTS
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel'  // parameters are in .babelrc
            },
            // STYLES
            {
                test: /\.scss$/,
                loader: extractSass.extract(['css','postcss','sass'])
            },
            // MEDIA
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
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"production"',
        'NODE_ENV': '"production"'
      }),
      extractSass,
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurenceOrderPlugin()
    ],
    postcss: [ autoprefixer({ browsers: ['last 3 versions'] }) ]
};
