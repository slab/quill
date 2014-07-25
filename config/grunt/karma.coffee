_  = require('lodash')
browsers = require('../browsers')

remoteReporters = ['dots']
remoteReporters.push('saucelabs') if process.env.TRAVIS_BRANCH == 'master'

remoteKarma = _.reduce(browsers, (memo, config, browser) ->
  memo[browser] =
    browsers: [browser]
    browserDisconnectTimeout: 10000
    browserDisconnectTolerance: 2
    browserNoActivityTimeout: 60000
    reporters: remoteReporters
  return memo
, {})

module.exports = (grunt) ->
  grunt.config('karma', _.extend(remoteKarma,
    options:
      configFile: 'config/karma.js'
    coverage:
      browserNoActivityTimeout: 30000
      browsers: ['PhantomJS']
      reporters: ['coverage']
    local:
      browsers: ['Chrome', 'Firefox', 'Safari']
    server:
      autoWatch: true
      browsers: []
      singleRun: false
    test:
      browsers: ['PhantomJS']
  ))
