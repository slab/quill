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
  resolve: ['', '.js', '.styl'],
  module: {
    loaders: [
      { test: /(src|test)\/.*\.js$/, loader: 'babel' },
      { test: /\.styl$/, loader: 'css-loader!stylus-loader' }
    ],
    noParse: [
      /\/node_modules\/clone\/clone\.js$/,
      /\/node_modules\/eventemitter3\/index\.js$/,
      /\/node_modules\/extend\/index\.js$/,
      /\/node_modules\/parchment\/dist\/parchment\.js$/
    ]
  },
  plugins: [ constantPack ]
};
