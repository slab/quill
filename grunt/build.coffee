module.exports = (grunt) ->
  grunt.config('browserify',
    options:
      alias: [
        '.build/lodash.js:lodash'
      ]
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
    all: ['dist']
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
  )

  grunt.config('lodash',
    options:
      modifier: 'modern'
      include: [
        'difference', 'flatten', 'intersection', 'last'
        'all', 'each', 'map', 'pluck', 'reduce'
        'bind', 'defer'
        'clone', 'defaults', 'has', 'keys', 'omit', 'values'
        'isArray', 'isElement', 'isEqual', 'isNumber', 'isObject', 'isString'
        'uniqueId'
      ]
      flags: ['debug']
    target:
      dest: '.build/lodash.js'
  )

  grunt.config('uglify',
    quill:
      files: { 'dist/quill.min.js': ['dist/quill.js'] }
  )

