var _  = require('lodash');
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

module.exports = function(config) {
  config.set({
    basePath: '../',
    frameworks: ['jasmine'],
    coverageReporter: {
      type: 'json',
      dir: '.build/coverage/karma/'
    },
    reporters: ['progress'],
    preprocessors: {
      '**/*.coffee': ['coffee'],
      '**/*.html': ['html2js']
    },
    colors: true,
    logLevel: config.LOG_INFO,
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
    customLaunchers: customLaunchers
  })

  if (process.env.TRAVIS) {
    config.transports = ['xhr-polling'];
  }
}
