module.exports = (grunt) ->
  require('load-grunt-tasks')(grunt)

  grunt.initConfig(
    pkg: grunt.file.readJSON('package.json')
  )

  require('./grunt/build')(grunt)
  require('./grunt/server')(grunt)
  require('./grunt/test')(grunt)

  grunt.registerTask('dev', ['connect:server', 'test:karma'])

  grunt.registerTask('dist', ['clean', 'lodash', 'browserify', 'uglify', 'stylus', 'concat'])
  grunt.registerTask('release', ['dist', 'shell:examples', 'copy', 'compress'])

  grunt.registerTask('server', ['connect:server:keepalive'])

  grunt.registerTask('test', ['karma:test'])

  grunt.registerTask('test:karma', ['karma:karma'])
  grunt.registerTask('test:unit', ['karma:test'])
  grunt.registerTask('test:unit:remote', ['karma:remote-mac', 'karma:remote-windows', 'karma:remote-linux', 'karma:remote-mobile', 'karma:remote-legacy'])

  grunt.registerTask('test:coverage', ['coffee:src', 'shell:instrument', 'connect:server', 'karma:coverage', 'clean:coffee', 'clean:coverage'])

