var _  = require('lodash');
var os = require('os');
var browsers = require('./browsers');

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
    files: [
      'node_modules/jquery/dist/jquery.js',
      'http://localhost:9000/test/quill.js',

      'test/fixtures/unit.html',
      'test/helpers/inject.coffee',
      'test/helpers/matchers.coffee',

      { pattern: 'test/fixtures/*.css', included: false },

      // We dont do **/*.coffee to control order of tests
      'test/unit/lib/*.coffee',
      'test/unit/core/*.coffee',
      'test/unit/modules/*.coffee',
      'test/unit/themes/*.coffee'
    ],
    exclude: [],
    coverageReporter: {
      type: 'json',
      dir: '.coverage/karma/'
    },
    reporters: ['progress'],
    preprocessors: {
      '**/*.coffee': ['coffee'],
      '**/*.html': ['html2js']
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    singleRun: true,
    sauceLabs: {
      startConnect: false,
      testName: 'quill-unit',
      build: os.hostname() + '-' + _.random(16*16*16*16).toString(16),
      options: {
        'public': 'public',
        'record-screenshots': false
      }
    },
    customLaunchers: customLaunchers
  })

  if (process.env.TRAVIS) {
    config.transports = ['xhr-polling'];
    config.sauceLabs.build = 'travis-' + process.env.TRAVIS_BUILD_ID;
    config.sauceLabs.tunnelIdentifier = process.env.TRAVIS_JOB_NUMBER;
  }
}
