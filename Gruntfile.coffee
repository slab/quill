module.exports = (grunt) ->
  require('load-grunt-tasks')(grunt)

  # Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')
  })

  require('./config/grunt/build')(grunt)
  require('./config/grunt/tests')(grunt)
  require('./config/grunt/watch')(grunt)

  grunt.registerTask('default', ['clean', 'coffee', 'copy', 'string-replace', 'browserify', 'concat', 'jade', 'stylus', 'imageEmbed'])

  grunt.registerTask('test', ['karma:unit'])
  grunt.registerTask('test:karma', ['karma:karma'])
  grunt.registerTask('test:exhaust', ['karma:exhaust'])
  grunt.registerTask('test:local', ['karma:local'])
  grunt.registerTask('test:remote', ['karma:remote-mac', 'karma:remote-windows', 'karma:remote-linux', 'karma:remote-mobile', 'karma:remote-legacy'])

  grunt.registerTask('test:wd', ['shell:wd-chrome-test'])
  grunt.registerTask('test:fuzz', ['shell:wd-chrome-fuzzer'])
  grunt.registerTask('test:replay', ['shell:wd-chrome-replay'])
  grunt.registerTask('test:wd firefox', ['shell:wd-firefox-test'])
  grunt.registerTask('test:fuzz firefox', ['shell:wd-firefox-fuzzer'])
  grunt.registerTask('test:replay firefox', ['shell:wd-firefox-replay'])
