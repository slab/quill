var _ = require('lodash');
var browsers = require('./browsers');
var connect = require('gulp-connect');
var gulp = require('gulp');
var karma = require('karma');
var sauce = require('./sauce');


module.exports = function(config) {
  var common = {
    urlRoot: '/karma/',
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
    },

    frameworks: ['jasmine'],
    reporters: ['progress'],
    preprocessors: {
      'src/**/*.js': ['babel'],
      'test/**/*.js': ['babel'],
      '**/*.html': ['html2js']
    },
    colors: true,
    autoWatch: false,
    singleRun: true,

    sauceLabs: {
      testName: 'quill-unit',
      options: {
        'public': 'public',
        'record-screenshots': false
      },
      build: sauce.build,
      username: sauce.username,
      accessKey: sauce.accessKey,
      tunnelIdentifier: sauce.tunnel
    },
    customLaunchers: _.reduce(browsers, function(memo, browser, name) {
      memo[name] = {
        base: 'SauceLabs',
        platform: browser[0],
        browserName: browser[1],
        version: browser[2]
      };
      return memo;
    }, {})
  };
  if (process.env.TRAVIS) {
    common.transports = ['polling'];
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
    }), function(code) {
      callback();
      process.exit(code);   // fking karma
    }).start();
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
      var server = new karma.Server(_.assign({}, common, remote), function(code) {
        callback();
        process.exit(code);   // fking karma
      }).start();
    });
  });
};
