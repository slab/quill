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
    }), function() {
      connect.serverClose();
      callback();
      process.exit();   // fking karma
    }).start();
  });
};
