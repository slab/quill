child_process = require('child_process')

module.exports = (grunt) ->
  require('load-grunt-tasks')(grunt)

  grunt.initConfig(
    pkg: grunt.file.readJSON('package.json')
  )

  require('./grunt/build')(grunt)
  require('./grunt/test')(grunt)

  grunt.registerTask('default', ['build'])

  grunt.registerTask('build', ['clean', 'lodash', 'browserify', 'uglify', 'concat', 'coffee'])

  grunt.registerTask('dev', 'All the tasks for Quill development', ->
    done = this.async()
    child_process.spawn('grunt', ['test:karma'], { stdio: 'inherit'})
    child_process.spawn('grunt', ['shell:server'], { stdio: 'inherit' })
  )

  grunt.registerTask('test', ['karma:test'])

  grunt.registerTask('test:karma', ['karma:karma'])
  grunt.registerTask('test:unit', ['karma:test'])
  grunt.registerTask('test:unit:remote', ['karma:remote-mac', 'karma:remote-windows', 'karma:remote-linux', 'karma:remote-mobile', 'karma:remote-legacy'])

  grunt.registerTask('test:coverage', ['coffee:src', 'shell:instrument', 'karma:coverage', 'clean:coffee', 'clean:coverage'])
