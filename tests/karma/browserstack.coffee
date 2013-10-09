_     = require('underscore')._
async = require('async')
karma = require('karma')
base  = require('./all.conf')

BROWSERSTACK_PARALLEL = process.env.BROWSERSTACK_PARALLEL or 4

browsers =
  'mac-chrome'  : ['OS X', 'Mountain Lion', 'chrome', '29.0']
  'mac-firefox' : ['OS X', 'Mountain Lion', 'firefox', '24.0']
  'mac-safari'  : ['OS X', 'Mountain Lion', 'safari', '6.0']

  'windows-8-chrome'  : ['Windows', '8', 'chrome', '29.0']
  'windows-8-firefox' : ['Windows', '8', 'firefox', '24.0']
  'windows-8-safari'  : ['Windows', '8', 'safari', '5.1']
  'windows-8-ie-10'   : ['Windows', '8', 'ie', '10.0']

  'windows-7-chrome'  : ['Windows', '7', 'chrome', '29.0']
  'windows-7-firefox' : ['Windows', '7', 'firefox', '24.0']
  'windows-7-safari'  : ['Windows', '7', 'safari', '5.1']
  'windows-7-ie-10'   : ['Windows', '7', 'ie', '10.0']
  'windows-7-ie-9'    : ['Windows', '7', 'ie', '9.0']
  'windows-7-ie-8'    : ['Windows', '7', 'ie', '8.0']

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

options = {}
base.call(null, {
  LOG_INFO: 'info'
  set: (opts) ->
    options = _.defaults(opts, options)
})
options.basePath = 'build'
options.customLaunchers = customLaunchers
options.exclude = ['tests/mocha/editor.js']

browserGroups = _.groupBy(browserList, (browser, i) ->
  return Math.floor(i / BROWSERSTACK_PARALLEL)
)
async.eachSeries(_.keys(browserGroups), (key, done) ->
  options.browsers = browserGroups[key]
  karma.server.start(options, (exitCode) ->
    setTimeout( ->
      done(if exitCode == 0 then null else new Error('Test failure'))
    , 1000)
  )
, (err) ->
  console.error(err) if err?
  process.exit(if err? then 1 else 0)
)
