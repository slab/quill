_  = require('underscore')._
os = require('os')

browsers =
  'mac-chrome'  : ['Mac 10.9', 'chrome']
  'mac-firefox' : ['Mac 10.9', 'firefox']
  'mac-safari'  : ['Mac 10.9', 'safari']

  'windows-chrome'  : ['Windows 8.1', 'chrome']
  'windows-firefox' : ['Windows 8.1', 'firefox']
  'windows-ie-11'   : ['Windows 8.1', 'internet explorer', '11']

  'windows-ie-10'   : ['Windows 8', 'internet explorer', '10']
  'windows-ie-9'    : ['Windows 7', 'internet explorer', '9']
  'windows-ie-8'    : ['Windows 7', 'internet explorer', '8']

  'linux-chrome'    : ['Linux', 'chrome']
  'linux-firefox'   : ['Linux', 'firefox']

  'iphone'  : ['Mac 10.8', 'iphone']
  'ipad'    : ['Mac 10.8', 'ipad']
  'android' : ['Linux', 'android']

customLaunchers = _.reduce(browsers, (memo, browser, name) ->
  [platform, browserName, browserVersion] = browser
  memo[name] =
    base: 'SauceLabs'
    platform: platform
    browserName: browserName
    version: browserVersion
  return memo
, {})

module.exports = (config) ->
  config.set(
    basePath: '../../build'
    frameworks: ['mocha']
    files: [
      'http://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.js'
      'tests/mocha/style.css'
      
      'lib/underscore.js'
      'lib/underscore.string.js'
      'lib/eventemitter2.js'
      'lib/linked_list.js'
      'lib/rangy-core.js'
      'lib/tandem-core.js'
      'lib/expect.js'

      'tests/mocha/fixture.html'
      'tests/karma/inject.js'
      'tests/karma/module-fix.js'

      'src/modules/*.js'
      'src/themes/picker.js'
      'src/themes/*.js'

      'src/format.js'
      'tests/karma/format-fix.js'

      'src/*.js'

      'tests/mocha/unit.js'
      'tests/mocha/editor.js'
    ]
    exclude: []
    coverageReporter: 
      type: 'lcov'
      dir: '../coverage/'
    reporters: ['progress']
    preprocessors: 
      'src/!(debug).js': ['coverage']
      'src/modules/*.js': ['coverage']
      'src/themes/!(snow).js': ['coverage']
      '**/*.html': ['html2js']
    port: 9876
    colors: true
    logLevel: config.LOG_INFO
    autoWatch: false
    captureTimeout: 60000
    singleRun: true
    sauceLabs:
      # Open source account, please do not abuse
      username: 'scribe'
      accessKey: 'e0d99fc3-17bc-4b0d-b131-8621bc81f5a0'
      build: process.env.TRAVIS_JOB_ID or os.hostname()
    customLaunchers: customLaunchers
  )
