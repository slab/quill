module.exports = (grunt) ->
  grunt.config('watch',
    options:
      interrupt: true
    scribe:
      files: ['src/**/*.coffee']
      tasks: ['concurrent:browserify-scribe']
    tests:
      files: ['tests/mocha/**/*.coffee']
      tasks: ['browserify:tests']
    coffee:
      files: ['demo/scripts/*.coffee', 'tests/karma/inject.coffee', 'tests/webdriver/**/*.coffee']
      tasks: ['newer:coffee:all']
    jade:
      files: ['demo/*.jade', 'tests/**/*.jade']
      tasks: ['newer:jade']
    stylus:
      files: ['demo/**/*.styl', 'src/**/*.styl', 'tests/**/*.styl']
      tasks: ['newer:stylus']
  )
