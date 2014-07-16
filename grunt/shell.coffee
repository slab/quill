module.exports = (grunt) ->
  grunt.registerTask('examples', ->
    grunt.util.spawn(
      cmd: './node_modules/.bin/harp'
      args: ['compile', 'examples/', '.build/quill/examples/']
      opts:
        stdio: 'inherit'
    , this.async())
  )

  grunt.registerTask('instrument', ->
    grunt.util.spawn(
      cmd: './node_modules/.bin/istanbul'
      args: ['instrument', 'lib/', '-o', 'src/']
      opts:
        stdio: 'inherit'
    , this.async())
  )

  grunt.registerMultiTask('webdriver-manager', 'Protractor webdriver manager', ->
    grunt.util.spawn(
      cmd: './node_modules/protractor/bin/webdriver-manager'
      args: [this.target]
      opts:
        stdio: 'inherit'
    , this.async())
  )

  grunt.config('webdriver-manager',
    start: {}
    status: {}
    update: {}
  )
