_    = require('underscore')._
base = require('./all.conf')


browsers =
  'mac-chrome'  : ['OS X', 'Mountain Lion', 'chrome', '27.0']
  'mac-firefox' : ['OS X', 'Mountain Lion', 'firefox', '21.0']
  'mac-safari'  : ['OS X', 'Mountain Lion', 'safari', '6.0']

  'windows-8-chrome'  : ['Windows', '8', 'chrome', '27.0']
  'windows-8-firefox' : ['Windows', '8', 'firefox', '21.0']
  'windows-8-safari'  : ['Windows', '8', 'safari', '5.1']
  'windows-8-ie-10'   : ['Windows', '8', 'ie', '10.0']

  'windows-7-chrome'  : ['Windows', '7', 'chrome', '27.0']
  'windows-7-firefox' : ['Windows', '7', 'firefox', '21.0']
  'windows-7-safari'  : ['Windows', '7', 'safari', '5.1']
  'windows-7-ie-10'   : ['Windows', '7', 'ie', '10.0']
  'windows-7-ie-9'    : ['Windows', '7', 'ie', '9.0']
  'windows-7-ie-8'    : ['Windows', '7', 'ie', '8.0']

  'windows-xp-chrome' : ['Windows', 'XP', 'chrome', '27.0']
  'windows-xp-firefox': ['Windows', 'XP', 'firefox', '21.0']
  'windows-xp-safari' : ['Windows', 'XP', 'safari', '5.1']
  'windows-xp-ie-8'   : ['Windows', 'XP', 'ie', '8.0']


module.exports = (config) ->
  base.call(this, config)
  browserList = []
  customLaunchers = _.reduce(browsers, (memo, browser, name) ->
    browserList.push(name)
    [osName, osVersion, browserName, browserVersion] = browser
    memo[name] =
      base: 'BrowserStack'
      browser: browserName
      browser_version: browserVersion
      os: osName
      os_version: osVersion
    return memo
  , {})
  config.set(
    exclude: ['tests/mocha/editor.js']
    browserStack:
      username: 'StypiAPIUser'
      accessKey: 'm2LGGyTRgKd453bAQhcb'
    customLaunchers: customLaunchers
    browsers: browserList
  )
