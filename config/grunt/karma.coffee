_  = require('lodash')
browsers = require('../browsers')

remoteReporters = ['dots']
remoteReporters.push('saucelabs') if process.env.TRAVIS_BRANCH == 'master'

remoteKarma = _.reduce(browsers, (memo, config, browser) ->
  memo[browser] =
    browsers: [browser]
    browserDisconnectTimeout: 10000
    browserDisconnectTolerance: 4
    browserNoActivityTimeout: 60000
    reporters: remoteReporters
  return memo
, {})

module.exports = (grunt) ->
  grunt.config('karma', _.extend(remoteKarma,
    options:
      configFile: 'config/karma.js'
      proxies:
        '/local': "http://localhost:#{grunt.config('port')}"
      files: [
        'node_modules/jquery/dist/jquery.js'
        'node_modules/lodash/lodash.js'

        "http://localhost:#{grunt.config('port')}/quill.base.css"
        "http://localhost:#{grunt.config('port')}/test/quill.js"

        'test/fixtures/unit.html'
        'test/helpers/inject.coffee'
        'test/helpers/matchers.coffee'

        { pattern: 'test/fixtures/*.css', included: false }

        # We dont do **/*.coffee to control order of tests
        'test/unit/lib/*.coffee'
        'test/unit/core/*.coffee'
        'test/unit/modules/*.coffee'
        'test/unit/themes/*.coffee'
      ]
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
      browsers: ['Chrome']
  ))
