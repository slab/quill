var _ = require('lodash');
var browsers = require('./browsers');
var connect = require('gulp-connect');
var gulp = require('gulp');
var karma = require('karma');

module.exports = function(config) {
  var common = {
    configFile: __dirname + '/karma.conf.js',
    files: [
      'node_modules/jquery/dist/jquery.js',
      'node_modules/lodash/index.js',

      'test/helpers/unit.js',
      'test/helpers/matchers.js',

      'http://' + config.host + '/quill.base.css',
      'http://' + config.host + '/test/quill.js'
    ],
    port: config.testPort,
    proxies: {
      '/favicon.png': 'http://' + config.host
    }
  }

  gulp.task('karma:server', function(callback) {
    var server = new karma.Server(_.assign({}, common, {
      autoWatch: true,
      browsers: [],
      singleRun: false
    }), callback).start();
  });

  gulp.task('karma:test', ['server'], function(callback) {
    var server = new karma.Server(_.assign({}, common, {
      browsers: ['Chrome']
    }), callback).start();
  });

  Object.keys(browsers).forEach(function(browser) {
    gulp.task('remote:unit-' + browser, ['build', 'server'], function(callback) {
      var remote = {
        browsers: [browser],
        browserDisconnectTimeout: 10000,
        browserDisconnectTolerance: 4,
        browserNoActivityTimeout: 60000,
        reporters: ['dots']
      };
      if (process.env.TRAVIS_BRANCH === 'master') {
        remote.reporters.push('saucelabs');
      }
      var server = new karma.Server(_.assign({}, common, remote), callback).start();
    });
  });
};
