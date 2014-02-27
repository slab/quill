_     = require('underscore')._
base  = require('./all.conf')
pkg   = require('../../package.json')

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
  # 'android' : ['Linux', 'android']       # Tests take wayyy too long

browserList = []
customLaunchers = _.reduce(browsers, (memo, browser, name) ->
  browserList.push(name)
  [platform, browserName, browserVersion] = browser
  memo[name] =
    base: 'SauceLabs'
    platform: platform
    browserName: browserName
    version: browserVersion
  return memo
, {})

module.exports = (config) ->
  base.call(this, config)
  config.set(
    sauceLabs:
      tags: [pkg.name]
      # Open source account, please do not abuse
      username: 'scribe'
      accessKey: 'e0d99fc3-17bc-4b0d-b131-8621bc81f5a0'
    browsers: browserList
    customLaunchers: customLaunchers
    exclude: ['tests/mocha/editor.js']
    reporters: ['dots']
  )
