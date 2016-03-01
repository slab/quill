var config = require('./webpack.config.js');
var path = require('path');

config.babel = {
  presets: ['es2015']
};
config.module.preLoaders = [
  { test: /\.js$/, exclude: path.resolve('node_modules'), loader: 'isparta' }
];

module.exports = config;
