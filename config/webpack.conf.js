var path = require('path');
var pkg = require('../package.json');
var webpack = require('webpack');

var constantPack = new webpack.DefinePlugin({
  QUILL_VERSION: JSON.stringify(pkg.version)
});

module.exports = {
  entry: {
    quill: ['./src/index.js']  // webpack workaround issue #300
  },
  output: {
    filename: 'quill.js',
    library: 'Quill',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, '..', '.build/quill/')
  },
  resolve: {
    alias: {
      'parchment': path.resolve(__dirname, '..', 'node_modules/parchment/src/parchment')
    },
    extensions: ['', '.js', '.styl', '.ts']
  },
  resolveLoader: {
    root: path.resolve(__dirname, '..', 'node_modules')
  },
  module: {
    loaders: [
      { test: /parchment\/src\/.*\.ts$/, loader: 'ts' },
      { test: /\.styl$/, loader: 'css!stylus' }, {
        test: /(src|test)\/.*\.js$/, loader: 'babel?presets[]=es2015&plugins[]=transform-runtime'
      },
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
  plugins: [ constantPack ],
  devtool: 'source-map'
};
