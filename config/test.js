var _ = require('lodash');
var browsers = require('./browsers');
var child_process = require('child_process');
var gulp = require('gulp');
var gutil = require('gulp-util');
var protractor = require('gulp-protractor').protractor;
var karma = require('karma');
var webpackConfig = require('./webpack.conf');


module.exports = function(config) {
  var karmaCommon = {
    configFile: __dirname + '/karma.conf.js',
    files: [
      'node_modules/jquery/dist/jquery.js',
      'node_modules/lodash/index.js',

      'http://' + config.host + '/quill.base.css',
      'http://' + config.host + '/test/quill.js'
    ],
    preprocessors: {
      'test/helpers/*.js': ['babel'],
      '**/*.html': ['html2js']
    },
    port: config.testPort,
    proxies: {
      '/favicon.png': 'http://' + config.host
    }
  }

  gulp.task('karma:coverage', ['server'], function(callback) {
    var server = new karma.Server(_.defaultsDeep({
      browsers: ['Chrome'],
      files: karmaCommon.files.slice(0, -1).concat(['test/quill.js']),
      preprocessors: {
        'test/quill.js': ['webpack'],
      },
      reporters: ['coverage'],
      webpack: _.defaultsDeep({
        module: {
          preLoaders: [{ test: /src\/.*\.js$/, loader: 'isparta' }]
        }
      }, webpackConfig),
      webpackMiddleware: {
        noInfo: true
      }
    }, karmaCommon), callback).start();
  });

  gulp.task('karma:server', function(callback) {
    var server = new karma.Server(_.defaults({
      autoWatch: true,
      browsers: [],
      singleRun: false
    }, karmaCommon), callback).start();
  });

  gulp.task('karma:test', ['server'], function(callback) {
    var server = new karma.Server(_.defaults({
      browsers: ['Chrome']
    }, karmaCommon), callback).start();
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
      var server = new karma.Server(_.defaults(remote, karmaCommon), callback).start();
    });
  });

  gulp.task('protractor:install', function(callback) {
    child_process.spawn('./node_modules/.bin/webdriver-manager', ['update'], {
      stdio: 'inherit'
    }).once('close', callback);
  });

  gulp.task('protractor:test', function() {
    gulp.src(['test/wd/e2e.js'])
      .pipe(protractor({
        configFile: 'config/protractor.conf.js',
        args: ['--baseUrl', 'http://' + config.host]
      })).on('error', function(e) {
        gutil.log(gutil.colors.red("[protractor] " + e.message));
      });
  });
};
