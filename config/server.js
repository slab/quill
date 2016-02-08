var gulp = require('gulp');
var gutil = require('gulp-util');
var webpack = require('webpack');
var webpackConfig = require('./webpack.conf');
var WebpackDevServer = require('webpack-dev-server');


module.exports = function(config) {
  gulp.task('server', function(callback) {
    var compiler = webpack(webpackConfig);
    var server = new WebpackDevServer(compiler, {
      contentBase: 'dist/',
      hot: false,
      stats: {
        assets: false,
        chunks: false,
        colors: true,
        errorDetails: true,
        hash: false,
        timings: false,
        version: false
      }
    });
    server.listen(config.serverPort, 'localhost', function(err) {
      if (err) throw new gutil.PluginError("webpack-dev-server", err);
      gutil.log("[webpack-dev-server] listening on", config.serverPort);
      callback();
    });
    process.on('SIGINT', function() {
      server.close();
      process.exit(0);
    });
  });

  gulp.task('watch', function() {
    gulp.watch('src/**/*.styl', ['theme']);
  });
};
