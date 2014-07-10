module.exports = (grunt) ->
  grunt.config('browserify',
    options:
      alias: ['.build/lodash.js:lodash']
      browserifyOptions:
        extensions: ['.js', '.coffee']
      bundleOptions:
        standalone: 'Quill'
      transform: ['coffeeify']
    quill:
      files:
        'dist/quill.js': ['src/quill.coffee']
  )

  grunt.config('clean',
    all: ['.build', 'dist']
    coffee: ['lib']
    coverage: ['src/**/*.js']
  )

  grunt.config('coffee',
    src:
      options:
        bare: true
      cwd: 'src/'
      dest: 'lib/'
      expand: true
      src: ['**/*.coffee']
      ext: '.js'
  )

  grunt.config('concat',
    options:
      banner:
        '/*! Quill Editor v<%= pkg.version %>\n' +
        ' *  https://quilljs.com/\n' +
        ' *  Copyright (c) 2014, Jason Chen\n' +
        ' *  Copyright (c) 2013, salesforce.com\n' +
        ' */\n'
    quill:
      files:
        'dist/quill.js': ['dist/quill.js']
        'dist/quill.min.js': ['dist/quill.min.js']
        'dist/quill.snow.css': ['dist/quill.snow.css']
  )

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

  grunt.config('lodash',
    options:
      modifier: 'modern'
      include: [
        'difference', 'flatten', 'intersection', 'last'
        'all', 'each', 'invoke', 'map', 'pluck', 'reduce'
        'bind', 'defer', 'partial'
        'clone', 'defaults', 'has', 'keys', 'omit', 'values'
        'isArray', 'isElement', 'isEqual', 'isNumber', 'isObject', 'isString'
        'uniqueId'
      ]
      flags: ['debug']
    target:
      dest: '.build/lodash.js'
  )

  grunt.config('stylus',
    options:
      compress: false
    themes:
      options:
        urlfunc: 'url'
      files: [{
        expand: true
        ext: '.css'
        flatten: true
        src: 'src/themes/**/*.styl'
        rename: (dest, src) ->
          return "dist/quill.#{src}"
      }]
  )

  grunt.config('uglify',
    quill:
      files: { 'dist/quill.min.js': ['dist/quill.js'] }
  )

