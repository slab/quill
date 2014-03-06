module.exports = (grunt) ->
  grunt.config('watch',
    scribe:
      files: ['src/**/*.coffee']
      tasks: ['browserify']
    coffee:
      files: ['demo/scripts/*.coffee', 'tests/**/*.coffee']
      tasks: ['newer:coffee']
    jade:
      files: ['demo/*.jade', 'tests/**/*.jade']
      tasks: ['newer:jade']
    stylus:
      files: ['demo/**/*.styl', 'tests/**/*.styl']
      tasks: ['newer:stylus']
    imageEmbed:
      files: ['build/demo/styles/*.css', 'build/tests/**/*.css']
      tasks: ['newer:imageEmbed']
  )
  