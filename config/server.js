var _ = require('lodash');
var gulp = require('gulp');
var gutil = require('gulp-util');
var webpack = require('webpack');
var webpackConfig = require('./webpack.conf');
var WebpackDevServer = require('webpack-dev-server');

var FAVICON = new Buffer('iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACf0lEQVR42r2XS2gTURSG04K2VReilorEECVKiJk8EYuurIgPEFddKW4El1J3FbRUEOzKKuhKdy4Uql0H0UVxoYIKkoWCrxaKz1qKTayNYv0O3IEhzNzecSYz8HNnJpPz3XPm3HPuxGIRHNlstqdQKBwul8tDpVLpDprg/BV63hJgPB7vAngU0HX0BtCSh76FCs7n89sBjqJZDfS343whFHCxWNyEsZvojwb8jok9YKw77tUDwzF6CtW8wPw2zwQvMN51+f3jf4MzmcwaDIxpPBb4S8Zd6JHHM9UgIa/q4OgqObFDQq+Z4G3fcLJ77TLwBSZ4gueSACaXmeRZv2FfidGHGo9+MO7N5XJbDOBLRKjoN+Eu69Y0Xu80haO3mGzzAz+I/np4Pk3YMwLnesoALv8ZMIYnk8lOTTLNCNyyrK2mcPQerTKeAA8PenhRQ70+4T95Vbv9rvcZF0MNPD/EmNDBmeB3qYDSF7geAb7fb+KdcTMM/CTjBtXVnMAv6BY6ThfcHLjUYvS1i1ejKjJPm+7PomP8rT2UJiPvygVekXbL+X3Ne37BcwfCaDRXmuCT6XR6vWwqDJdaRVZQkAl8cPZxIrKHe9cM4Z9RX5DwF5qMnlcygY+TpN1Bwz/sMPpEst6rEjqTUBpRKAmIscfK6C/G07LuNfCG5AsrY10ocGr6ahsoPZtxzsPjRcYbUglD3VwSxn12b0efXMBfVWdMtGRbLXs4j7o/Ltttrle07CNCdT57xyNldkSWUyqV6ojiI6YN2D17wyi5EIvyIPTnFHyOUG+LFA60X9a50pGo4ZZ8QCjvL0Ud9m675kvzCK2V+qh4F9Ez+Xqhkm2MRXz8AzAAXszjgRshAAAAAElFTkSuQmCC', 'base64');


module.exports = function(config) {
  gulp.task('server', function(callback) {
    webpackConfig = _.clone(webpackConfig);
    webpackConfig.entry = {
      'quill': [webpackConfig.entry],  // webpack workaround issue #300
      'test/quill': './test/quill.js'
    };
    webpackConfig.output = _.assign({}, webpackConfig.output, {
      filename: '[name].js'
    });
    var compiler = webpack(webpackConfig);
    var server = new WebpackDevServer(compiler, {
      contentBase: '.build/quill/',
      hot: false,
      proxy: [{
        path: /\/(base|karma)\/*/,
        target: 'http://localhost:' + config.testPort
      }, {
        path: '/develop/*',
        rewrite: function(req, opt) {
          req.url = req.url.slice('/develop'.length);
        },
        target: 'http://localhost:' + config.serverPort
      }],
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
    server.app.use('/favicon.png', function(req, res, next) {
      res.setHeader('Content-Type', 'image/png');
      res.end(FAVICON);
    });
    server.listen(config.serverPort, 'localhost', function(err) {
      if (err) throw new gutil.PluginError("webpack-dev-server", err);
      gutil.log("[webpack-dev-server] listening on", config.serverPort);
      callback();
      gulp.on('stop', function() {
        process.exit(1);  // webpack does not have close
      });
    });
  });

  gulp.task('watch', function() {
    gulp.watch('examples/*.jade', ['examples:html']);
    gulp.watch('examples/styles/*.styl', ['examples:styles']);
    gulp.watch('examples/scripts/*.js', ['examples:scripts']);

    gulp.watch('src/**/*.styl', ['theme']);
  });
};
