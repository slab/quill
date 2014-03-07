module.exports = (grunt) ->
  grunt.config('concurrent',
    browserify:
      tasks: ['browserify:scribe', 'browserify:exposed', 'browserify:tests']
    'browserify-scribe':
      tasks: ['browserify:scribe', 'browserify:exposed']
    template:
      tasks: ['coffee:all', 'jade', 'stylus']
  )
