_ = require('lodash')
browsers = require('../browsers')
sauce = require('../sauce')

remoteProtractor = _.reduce(browsers, (memo, config, browser) ->
  return _.reduce(['e2e', 'wd'], (memo, test) ->
    options =
      configFile: 'config/protractor.js'
      args:
        capabilities:
          name: "quill-#{test}"
          platform: config[0]
          browserName: config[1]
          version: config[2]
          build: sauce.build
          'tunnel-identifier': sauce.tunnel
        sauceUser: sauce.username
        sauceKey: sauce.accessKey
        specs: ['test/wd/*.coffee']
      jasmineNodeOpts:
        isVerbose: false
    options.args.exclude = ['test/wd/e2e.coffee'] if test == 'wd'
    memo["#{test}-#{browser}"] = { options: options }
    return memo
  , memo)
, {})

module.exports = (grunt) ->
  grunt.config('protractor', _.extend(remoteProtractor,
    coverage:
      options:
        configFile: 'config/protractor.coverage.js'
        args:
          specs: ['test/wd/*.coffee']
    test:
      options:
        configFile: 'config/protractor.js'
        args:
          exclude: ['test/wd/e2e.coffee']
          specs: ['test/wd/*.coffee']
    e2e:
      options:
        configFile: 'config/protractor.js'
        args:
          specs: ['test/wd/e2e.coffee']
  ))

  grunt.config('sauce_connect',
    quill:
      options:
        username: sauce.username
        accessKey: sauce.accessKey
        tunnelIdentifier: sauce.tunnel
  )

  grunt.registerMultiTask('webdriver-manager', 'Protractor webdriver manager', ->
    grunt.util.spawn(
      cmd: './node_modules/protractor/bin/webdriver-manager'
      args: [this.target]
      opts:
        stdio: 'inherit'
    , this.async())
  )

  grunt.config('webdriver-manager',
    start: {}
    status: {}
    update: {}
  )
