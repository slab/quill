var config = require('./webpack.config.js');
var path = require('path');

config.module.postLoaders = [{
  test: /\.js$/,
  loader: 'isparta',
  exclude: [
    path.resolve(__dirname, '..', 'node_modules'),
    path.resolve(__dirname, '..', 'test')
  ]
}];

module.exports = config;
