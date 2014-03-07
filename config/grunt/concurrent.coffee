module.exports = (grunt) ->
  grunt.config('concurrent',
    browserify:
      tasks: ['browserify:scribe', 'browserify:exposed', 'browserify:tests']
    template:
      tasks: ['coffee:all', 'jade', 'stylus']
  )
