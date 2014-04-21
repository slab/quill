module.exports = (grunt) ->
  grunt.config('watch',
    options:
      interrupt: true
    coffee:
      files: ['demo/scripts/*.coffee', 'test/**/*.coffee']
      tasks: ['newer:coffee:all']
    jade:
      files: ['demo/*.jade', 'test/**/*.jade']
      tasks: ['newer:jade']
    stylus:
      files: ['demo/**/*.styl', 'src/**/*.styl']
      tasks: ['newer:stylus']
  )
