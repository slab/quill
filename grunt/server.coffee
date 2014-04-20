module.exports = (grunt) ->
  grunt.config('connect',
    server:
      options:
        keepalive: true
        port: 9000
  )
