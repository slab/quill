var path = require('path');
var pkg = require('../package.json');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var constantPack = new webpack.DefinePlugin({
  QUILL_VERSION: JSON.stringify(pkg.version)
});

module.exports = {
  context: path.resolve(__dirname, '..'),
  entry: {
    'quill.js': ['./quill.js'],
    'quill.css': './assets/core.styl',
    'quill.bubble.css': './assets/bubble.styl',
    'quill.snow.css': './assets/snow.styl',
    'unit.js': './test/unit.js'
  },
  output: {
    filename: '[name]',
    library: 'Quill',
    libraryTarget: 'umd',
    path: 'dist/'
  },
  resolve: {
    alias: {
      'parchment': path.resolve(__dirname, '..', 'node_modules/parchment/src/parchment')
    },
    extensions: ['', '.js', '.styl', '.ts']
  },
  module: {
    loaders: [
      { test: /parchment\/src\/.*\.ts$/, loader: 'ts' },
      { test: /\.styl$/, loader: ExtractTextPlugin.extract('style', 'css!stylus') },
      { test: /(?!node_modules)\/.*\.js$/, loader: 'babel?presets[]=es2015' },
      { test: /\.svg$/, loader: 'html?minimize=true' }
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
      target: 'es5',
      module: 'commonjs'
    },
    silent: true
  },
  plugins: [ constantPack, new ExtractTextPlugin('[name]', { allChunks: true }) ],
  devtool: 'source-map',
  devServer: {
    hot: false,
    port: 9080,
    stats: {
      assets: false,
      chunks: false,
      errorDetails: true,
      errors: true,
      hash: false,
      timings: false,
      version: false,
      warnings: true
    }
  }
};
