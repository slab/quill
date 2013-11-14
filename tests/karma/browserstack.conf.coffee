_     = require('underscore')._
base  = require('./all.conf')

browsers =
  'mac-chrome'  : ['OS X', 'Mountain Lion', 'chrome', '30.0 beta']
  'mac-firefox' : ['OS X', 'Mountain Lion', 'firefox', 'latest']
  'mac-safari'  : ['OS X', 'Mountain Lion', 'safari', 'latest']

  'windows-8-chrome'  : ['Windows', '8', 'chrome', '30.0 beta']
  'windows-8-firefox' : ['Windows', '8', 'firefox', 'latest']
  'windows-8-safari'  : ['Windows', '8', 'safari', 'latest']
  'windows-8-ie-10'   : ['Windows', '8', 'ie', '10.0']

  'windows-7-ie-9'    : ['Windows', '7', 'ie', '9.0']
  'windows-7-ie-8'    : ['Windows', '7', 'ie', '8.0']

  #'iphone'  : ['ios', '7.0', 'iPhone 5S']
  #'ipad'    : ['ios', '7.0', 'iPad 3rd (7.0)']
  #'android' : ['android', '4.2', 'LG Nexus 4']       # Tests take wayyy too long
browserList = []
customLaunchers = _.reduce(browsers, (memo, browser, name) ->
  browserList.push(name)
  [osName, osVersion, browserName, browserVersion] = browser
  memo[name] =
    base: 'BrowserStack'
    os: osName
    os_version: osVersion
  if browserVersion?
    memo[name].browser = browserName
    memo[name].browser_version = browserVersion
  else
    memo[name].device = browserName
  return memo
, {})

module.exports = (config) ->
  base.call(this, config)
  config.set(
    browsers: browserList
    customLaunchers: customLaunchers
    exclude: ['tests/mocha/editor.js']
    reporters: ['dots']
  )
