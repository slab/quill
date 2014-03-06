module.exports = (grunt) ->
  grunt.config('watch', 
    'coffee-demo':
      files: ['demo/scripts/*.coffee']
      tasks: ['coffee:demo']
    'coffee-src':
      files: ['index.coffee', 'src/**/*.coffee']
      tasks: ['coffee:src', 'string-replace', 'browserify', 'uglify', 'concat']
    'coffee-test':
      files: ['tests/mocha/**/*.coffee']
      tasks: ['coffee:test']
    jade:
      files: ['demo/*.jade', 'tests/**/*.jade', '!demo/content.jade']
      tasks: ['jade']
    stylus:
      files: ['demo/styles/*.styl', 'tests/mocha/*.styl']
      tasks: ['stylus', 'imageEmbed']
  )

  grunt.event.on('watch', (action, filepath) ->
    if grunt.file.isMatch(grunt.config('watch.coffee-demo.files'), filepath)
      grunt.config('coffee.demo.src', filepath)
    else if grunt.file.isMatch(grunt.config('watch.coffee-src.files'), filepath)
      grunt.config('coffee.src.src', filepath)
    else if grunt.file.isMatch(grunt.config('watch.jade.files'), filepath)
      grunt.config('jade.all.src', filepath)
    else if grunt.file.isMatch(grunt.config('watch.stylus.files'), filepath)
      grunt.config('stylus.all.src', filepath)
  )
