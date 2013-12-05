_     = require('underscore')._
base  = require('./all.conf')
pjson = require('../../package.json')

browsers =
  'mac-chrome'  : ['OS X', 'Mavericks', 'chrome', 'latest']
  'mac-firefox' : ['OS X', 'Mavericks', 'firefox', 'latest']
  'mac-safari'  : ['OS X', 'Mavericks', 'safari', 'latest']

  'windows-8-chrome'  : ['Windows', '8.1', 'chrome', 'latest']
  'windows-8-firefox' : ['Windows', '8.1', 'firefox', 'latest']
  'windows-8-ie-11'   : ['Windows', '8.1', 'ie', '11.0']
  'windows-8-ie-10'   : ['Windows', '8', 'ie', '10.0']

  'windows-7-ie-9'    : ['Windows', '7', 'ie', '9.0']
  'windows-7-ie-8'    : ['Windows', '7', 'ie', '8.0']

  'iphone'  : ['ios', '7.0', 'iPhone 5S']
  'ipad'    : ['ios', '7.0', 'iPad 3rd (7.0)']
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
    browserStack:
      project: pjson.name
      build: pjson.version
    browsers: browserList
    customLaunchers: customLaunchers
    exclude: ['tests/mocha/editor.js']
    reporters: ['dots']
  )
