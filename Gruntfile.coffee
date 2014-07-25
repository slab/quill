_ = require('lodash')
fs = require('fs')
browsers = require('./config/browsers')

GRUNT_DIR = 'config/grunt'

module.exports = (grunt) ->
  require('load-grunt-tasks')(grunt)

  grunt.initConfig(
    pkg: grunt.file.readJSON('package.json')
  )

  files = fs.readdirSync(GRUNT_DIR)
  files.forEach((file) ->
    require("./#{GRUNT_DIR}/#{file}")(grunt)
  )

  grunt.registerTask('dev', ['connect:server', 'karma:server'])

  grunt.registerTask('dist', ['clean', 'lodash', 'browserify', 'uglify', 'stylus', 'concat'])
  grunt.registerTask('release', ['dist', 'examples', 'copy', 'compress'])

  grunt.registerTask('server', ['connect:server:keepalive'])

  grunt.registerTask('test', ['karma:test'])

  grunt.registerTask('test:unit', ['karma:test'])
  grunt.registerTask('test:wd', ['protractor:test'])
  grunt.registerTask('test:e2e', ['protractor:e2e'])

  grunt.registerTask('test:coverage', [
    'lodash', 'coffee:quill', 'istanbul:instrument'
    'connect:server', 'karma:coverage', 'protractor:coverage', 'istanbul:report'
    'clean:coffee', 'clean:coverage'
  ])

  _.each(browsers, (config, browser) ->
    grunt.registerTask("test:#{browser}", [
      'connect:server'
      "karma:#{browser}"
      "protractor:wd-#{browser}"
      "protractor:e2e-#{browser}"
    ])
  )
