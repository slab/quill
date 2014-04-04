module.exports = (grunt) ->
  grunt.config('concurrent',
    browserify:
      tasks: ['browserify:quill', 'browserify:exposed', 'browserify:tests']
    'browserify-quill':
      tasks: ['browserify:quill', 'browserify:exposed']
    template:
      tasks: ['coffee:all', 'jade', 'stylus']
  )
