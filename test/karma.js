var _  = require('lodash');
var os = require('os');


var CHROME_VERSION = '35'
var FIREFOX_VERSION = '30'
var SAFARI_VERSION = '7'
var IOS_VERSION = '7.1'
var ANDROID_VERSION = '4.3'

var browsers = {
  'mac-chrome'  : ['Mac 10.9', 'chrome', CHROME_VERSION],
  'mac-firefox' : ['Mac 10.9', 'firefox', FIREFOX_VERSION],
  'mac-safari'  : ['Mac 10.9', 'safari', SAFARI_VERSION],

  'windows-chrome'  : ['Windows 8.1', 'chrome', CHROME_VERSION],
  'windows-firefox' : ['Windows 8.1', 'firefox', FIREFOX_VERSION],
  'windows-ie-11'   : ['Windows 8.1', 'internet explorer', '11'],

  'windows-ie-10'   : ['Windows 7', 'internet explorer', '10'],
  'windows-ie-9'    : ['Windows 7', 'internet explorer', '9'],

  'linux-chrome'    : ['Linux', 'chrome', CHROME_VERSION],
  'linux-firefox'   : ['Linux', 'firefox', FIREFOX_VERSION],

  'iphone'  : ['Mac 10.9', 'iphone', IOS_VERSION],
  'ipad'    : ['Mac 10.9', 'ipad', IOS_VERSION],
  'android' : ['Linux', 'android', ANDROID_VERSION]
}

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
      'test/helpers/*.coffee',

      { pattern: 'test/fixtures/*.css', included: false },

      'test/unit/*.coffee',     // We dont do **/*.coffee to control order of tests
      'test/unit/lib/*.coffee',
      'test/unit/modules/*.coffee',
      'test/unit/themes/*.coffee'
    ],
    exclude: [],
    coverageReporter: {
      type: 'lcov',
      dir: '../coverage/'
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
      testName: 'Quill',
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
  }
  if (process.env.TRAVIS_BRANCH !== 'master' || process.env.TRAVIS_PULL_REQUEST !== 'false') {
    process.env.SAUCE_USERNAME = 'quill';
    process.env.SAUCE_ACCESS_KEY = 'adc0c0cf-221b-46f1-81b9-a4429b722c2e';
  }
}
