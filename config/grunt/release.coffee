module.exports = (grunt) ->
  grunt.config('compress',
    dist:
      options:
        archive: '.build/quill.tar.gz'
        mode: 'tgz'
      files: [{
        cwd: '.build/quill'
        src: ['**/*']
        dest: 'quill/'
        expand: true
      }]
  )

  grunt.config('copy',
    dist:
      files: [{
        src: 'dist/*'
        dest: '.build/quill/'
        expand: true
        flatten: true
      }]
  )

  grunt.registerTask('examples', ->
    grunt.util.spawn(
      cmd: './node_modules/.bin/harp'
      args: ['compile', 'examples/', '.build/quill/examples/']
      opts:
        stdio: 'inherit'
    , this.async())
  )
