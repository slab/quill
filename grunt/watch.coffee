module.exports = (grunt) ->
  grunt.config('watch',
    options:
      interrupt: true
    coffee:
      files: ['examples/scripts/*.coffee', 'test/**/*.coffee']
      tasks: ['newer:coffee:all']
    jade:
      files: ['examples/*.jade', 'test/**/*.jade']
      tasks: ['newer:jade']
    stylus:
      files: ['examples/**/*.styl', 'src/**/*.styl']
      tasks: ['newer:stylus']
  )
