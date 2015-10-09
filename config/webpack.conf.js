var path = require('path');
var pkg = require('../package.json');
var webpack = require('webpack');

var constantPack = new webpack.DefinePlugin({
  QUILL_VERSION: JSON.stringify(pkg.version)
});

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'quill.js',
    library: 'Quill',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, '..', '.build/quill/')
  },
  resolve: {
    alias: {
      'babel-runtime': path.resolve(__dirname, '..', 'node_modules/babel-runtime'),
      'parchment': path.resolve(__dirname, '..', 'node_modules/parchment/src/parchment')
    },
    extensions: ['', '.js', '.styl', '.ts']
  },
  resolveLoader: {
    root: path.resolve(__dirname, '..', 'node_modules')
  },
  module: {
    loaders: [
      { test: /parchment\/src\/.*\.ts$/, loader: 'babel-loader?optional[]=runtime!ts-loader' },
      { test: /(src|test)\/.*\.js$/, loader: 'babel-loader?optional[]=runtime' },
      { test: /\.styl$/, loader: 'css-loader!stylus-loader' }
    ],
    noParse: [
      /\/node_modules\/clone\/clone\.js$/,
      /\/node_modules\/eventemitter3\/index\.js$/,
      /\/node_modules\/extend\/index\.js$/
    ]
  },
  ts: {
    configFileName: 'nonexistent.json',   // Parchment tsconfig wants to build tests, we don't
    compilerOptions: {
      target: 'es6'
    },
    silent: true
  },
  plugins: [ constantPack ]
};
