module.exports = (grunt) ->
  grunt.config('protractor',
    coverage:
      options:
        configFile: 'config/protractor.coverage.js'
    test:
      options:
        configFile: 'config/protractor.js'
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
