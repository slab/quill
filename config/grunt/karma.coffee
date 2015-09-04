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
      files: [
        'node_modules/jquery/dist/jquery.js'
        'node_modules/lodash/index.js'

        'test/helpers/matchers.coffee'

        grunt.config('baseUrl') + 'quill.base.css'
        grunt.config('baseUrl') + 'test/quill.js'
      ]
      port: grunt.config('karmaPort')
    coverage:
      browserNoActivityTimeout: 30000
      browsers: ['Chrome']
      reporters: ['coverage']
    local:
      browsers: ['Chrome', 'Firefox', 'Safari']
    server:
      autoWatch: true
      browsers: []
      urlRoot: '/karma/'    # TODO move this back into karma.js as soon as urlRoot works for socket.io again
      singleRun: false
    test:
      browsers: ['Chrome']
  ))
