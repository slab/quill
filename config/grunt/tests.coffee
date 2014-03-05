fs = require('fs')

replay = ''
if fs.existsSync('tests/webdriver/fuzzer_output/fails')
  replay = fs.readdirSync('tests/webdriver/fuzzer_output/fails')[0] or ''

remoteReporter = ['dots']
remoteReporter.push('saucelabs') # if process.env.TRAVIS_JOB_ID?

module.exports = (grunt) ->
  grunt.config('karma', 
    options:
      configFile: 'tests/karma/karma.conf.coffee'
      exclude: ['tests/mocha/editor.js']
    karma:
      singleRun: false
    unit:
      browsers: ['PhantomJS']
    exhaust:
      exclude: ['tests/mocha/unit.js']
      browsers: ['PhantomJS']
    local:
      browsers: ['Chrome', 'Firefox', 'Safari']
    'remote-mac':
      browsers: ['mac-chrome', 'mac-firefox', 'mac-safari']
      reporters: remoteReporter
    'remote-windows':
      browsers: ['windows-chrome', 'windows-firefox', 'windows-ie-11']
      reporters: remoteReporter
    'remote-legacy':
      browsers: ['windows-ie-10', 'windows-ie-9', 'windows-ie-8']
      reporters: remoteReporter
    'remote-linux':
      browsers: ['linux-chrome', 'linux-firefox']
      reporters: remoteReporter
    'remote-mobile':
      browsers: ['ipad', 'iphone']      # Testing on android is currently too slow
      reporters: remoteReporter
  )

  grunt.config('shell',
    options:
      stdout: true
    'wd-chrome-test':    { command: 'ruby tests/webdriver/unit/unit_runner.rb chrome' }
    'wd-chrome-fuzzer':  { command: 'ruby tests/webdriver/fuzzer.rb chrome' }
    'wd-chrome-replay':  { command: "ruby tests/webdriver/fuzzer.rb chrome #{replay}" }
    'wd-firefox-test':   { command: 'ruby tests/webdriver/unit/unit_runner.rb firefox' }
    'wd-firefox-fuzzer': { command: 'ruby tests/webdriver/fuzzer.rb firefox' }
    'wd-firefox-replay': { command: "ruby tests/webdriver/fuzzer.rb firefox #{replay}" }
  )
