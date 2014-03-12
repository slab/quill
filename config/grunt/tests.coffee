_  = require('lodash')
fs = require('fs')

replay = ''
if fs.existsSync('tests/webdriver/fuzzer_output/fails')
  replay = fs.readdirSync('tests/webdriver/fuzzer_output/fails')[0] or ''

remoteReporter = ['dots']
remoteReporter.push('saucelabs') if process.env.TRAVIS_BRANCH == 'master'

remoteBrowserGroups =
  'mac'     : ['mac-chrome', 'mac-firefox', 'mac-safari']
  'windows' : ['windows-chrome', 'windows-firefox', 'windows-ie-11']
  'legacy'  : ['windows-ie-10', 'windows-ie-9', 'windows-ie-8']
  'linux'   : ['linux-chrome', 'linux-firefox']
  'mobile'  : ['ipad', 'iphone']

remoteKarma = _.reduce(remoteBrowserGroups, (memo, browsers, group) ->
  memo["remote-#{group}"] =
    browsers: browsers
    reporters: remoteReporter
  _.each(browsers, (browser) ->
    memo["remote-#{browser}"] =
      browsers: [browser]
      reporters: remoteReporter
  )
  return memo
, {})

module.exports = (grunt) ->
  grunt.config('karma', _.extend(remoteKarma,
    options:
      configFile: 'tests/karma/karma.conf.coffee'
      exclude: ['tests/mocha/editor.js']
    karma:
      autoWatch: true
      singleRun: false
    unit:
      browsers: ['PhantomJS']
    exhaust:
      exclude: ['tests/mocha/unit.js']
      browsers: ['PhantomJS']
    local:
      browsers: ['Chrome', 'Firefox', 'Safari']
    coverage:
      browsers: ['PhantomJS']
      reporters: ['coverage']
  ))

  grunt.config('shell',
    options:
      stdout: true
    'instrument'        : { command: './node_modules/.bin/istanbul instrument build/src -o src/' }
    'wd-chrome-test'    : { command: 'ruby tests/webdriver/unit/unit_runner.rb chrome' }
    'wd-chrome-fuzzer'  : { command: 'ruby tests/webdriver/fuzzer.rb chrome' }
    'wd-chrome-replay'  : { command: "ruby tests/webdriver/fuzzer.rb chrome #{replay}" }
    'wd-firefox-test'   : { command: 'ruby tests/webdriver/unit/unit_runner.rb firefox' }
    'wd-firefox-fuzzer' : { command: 'ruby tests/webdriver/fuzzer.rb firefox' }
    'wd-firefox-replay' : { command: "ruby tests/webdriver/fuzzer.rb firefox #{replay}" }
  )
