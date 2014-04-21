var _  = require('lodash');
var os = require('os');


var browsers = {
  'mac-chrome'  : ['Mac 10.9', 'chrome', '33'],
  'mac-firefox' : ['Mac 10.9', 'firefox', '28'],
  'mac-safari'  : ['Mac 10.9', 'safari', '7'],

  'windows-chrome'  : ['Windows 8.1', 'chrome', '33'],
  'windows-firefox' : ['Windows 8.1', 'firefox', '28'],
  'windows-ie-11'   : ['Windows 8.1', 'internet explorer', '11'],

  'windows-ie-10'   : ['Windows 7', 'internet explorer', '10'],
  'windows-ie-9'    : ['Windows 7', 'internet explorer', '9'],
  'windows-ie-8'    : ['Windows 7', 'internet explorer', '8'],

  'linux-chrome'    : ['Linux', 'chrome', '33'],
  'linux-firefox'   : ['Linux', 'firefox', '28'],

  'iphone'  : ['Mac 10.9', 'iphone', '7.1'],
  'ipad'    : ['Mac 10.9', 'ipad', '7.1'],
  'android' : ['Linux', 'android', '4.3']
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
    basePath: '../build',
    frameworks: ['mocha'],
    files: [
      '../node_modules/jquery/dist/jquery.js',
      '../node_modules/lodash/lodash.js',
      '../node_modules/async/lib/async.js',
      'tandem-core.js',
      '../node_modules/expect.js/index.js',

      'test/fixtures/unit.html',
      'test/helpers/*.js',

      'quill.exposed.js',

      'test/unit/*.js'
    ],
    exclude: [],
    coverageReporter: {
      type: 'lcov',
      dir: '../coverage/'
    },
    reporters: ['progress'],
    preprocessors: {
      '**/*.html': ['html2js']
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    singleRun: true,
    sauceLabs: {
      testName: 'Quill',
      username: 'quill',
      accessKey: 'adc0c0cf-221b-46f1-81b9-a4429b722c2e',
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
    if (process.env.TRAVIS_BRANCH == 'master') {
      config.sauceLabs.username = 'quill-master';
      config.sauceLabs.accessKey = '685c8996-7b70-4543-8167-58f8e88a8484';
    }
  }
}
