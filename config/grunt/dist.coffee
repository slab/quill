module.exports = (grunt) ->
  grunt.config('browserify',
    quill:
      options:
        browserifyOptions:
          extensions: ['.js', '.coffee']
          standalone: 'Quill'
        transform: ['coffeeify', 'stylify']
      files:
        'dist/quill.js': ['src/index.coffee']
  )

  grunt.config('clean',
    all: ['.build', 'dist']
    coffee: ['lib']
    coverage: ['src/**/*.js']
  )

  grunt.config('coffee',
    quill:
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

  grunt.config('lodash',
    options:
      modifier: 'modern'
      include: [
        'difference', 'intersection', 'last'
        'all', 'each', 'invoke', 'map', 'reduce'
        'bind', 'defer', 'partial'
        'clone', 'extend', 'defaults', 'omit', 'values'
        'isElement', 'isEqual', 'isNumber', 'isObject', 'isString'
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

