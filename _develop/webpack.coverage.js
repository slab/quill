var config = require('./webpack.config.js');
var path = require('path');

config.module.postLoaders = [{
  test: /\.js$/,
  loader: 'istanbul-instrumenter',
  exclude: [
    path.resolve(__dirname, '..', 'node_modules'),
    path.resolve(__dirname, '..', 'test'),
    path.resolve(__dirname, '..', 'core/polyfill.js'),
    path.resolve(__dirname, '..', 'core.js'),
    path.resolve(__dirname, '..', 'quill.js')
  ]
}];
config.module.loaders[3].query = {
  plugins: ['transform-es2015-modules-commonjs']
};

module.exports = config;
