_  = require('lodash')
os = require('os')

browsers =
  'mac-chrome'  : ['Mac 10.9', 'chrome']
  'mac-firefox' : ['Mac 10.9', 'firefox']
  'mac-safari'  : ['Mac 10.9', 'safari']

  'windows-chrome'  : ['Windows 8.1', 'chrome']
  'windows-firefox' : ['Windows 8.1', 'firefox']
  'windows-ie-11'   : ['Windows 8.1', 'internet explorer', '11']

  'windows-ie-10'   : ['Windows 7', 'internet explorer', '10']
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
  if process.env.TRAVIS_BUILD_ID?
    build = 'travis-' + process.env.TRAVIS_BUILD_ID
  else
    build = os.hostname() + '-' + _.random(16*16*16*16).toString(16)

  # Open source accounts, please do not abuse
  if process.env.TRAVIS_BRANCH == 'master'
    username = 'scribe-master'
    accessKey = '2da1aa8f-4d9b-4691-90d4-76c9f5ee7caf'
  else
    username = 'scribe'
    accessKey = 'e0d99fc3-17bc-4b0d-b131-8621bc81f5a0'

  config.set(
    basePath: '../../build'
    frameworks: ['mocha']
    files: [
      'tests/mocha/style.css'

      '../node_modules/jquery/dist/jquery.js'
      '../node_modules/lodash/lodash.js'
      '../node_modules/async/lib/async.js'

      'tests/mocha/fixture.html'
      'tests/karma/inject.js'

      'scribe.exposed.js'

      'tests/mocha/functional.js'
      'tests/mocha/unit.js'
      'tests/mocha/editor.js'
    ]
    exclude: []
    coverageReporter:
      type: 'lcov'
      dir: '../coverage/'
    reporters: ['progress']
    preprocessors:
      '**/*.html': ['html2js']
    port: 9876
    colors: true
    logLevel: config.LOG_INFO
    autoWatch: false
    captureTimeout: 60000
    singleRun: true
    sauceLabs:
      username: username
      accessKey: accessKey
      build: build
    customLaunchers: customLaunchers
  )
