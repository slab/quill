var _ = require('lodash');
var browsers = require('./browsers');
var sauce = require('./sauce');

var customLaunchers = _.reduce(browsers, function(memo, browser, name) {
  memo[name] = {
    base: 'SauceLabs',
    platform: browser[0],
    browserName: browser[1],
    version: browser[2]
  };
  return memo;
}, {});


var config = {
  basePath: '../',
  frameworks: ['jasmine'],
  coverageReporter: {
    type: 'json',
    dir: '.build/coverage/karma/'
  },
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
  customLaunchers: customLaunchers,
  port: 9876
}
if (process.env.TRAVIS) {
  config.transports = ['polling'];
}


module.exports = config;
