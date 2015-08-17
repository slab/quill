derequire = require('derequire/plugin')
fs = require('fs')
through = require('through')


versionify = (file) ->
  data = ''
  write = (buf) ->
    data += buf
  end = ->
    if file.indexOf('package.json') > -1
      version = JSON.parse(data).version
      this.queue(JSON.stringify({ version: version }))
    else
      this.queue(data)
    this.queue(null)
  return through(write, end)


module.exports = (grunt) ->
  grunt.config('browserify',
    quill:
      options:
        browserifyOptions:
          extensions: ['.js', '.coffee']
          standalone: 'Quill'
        transform: ['coffeeify', 'stylify', versionify]
        plugin: [derequire]
      files:
        'dist/quill.js': ['src/index.coffee']
  )

  grunt.config('clean',
    all: ['.build', 'dist']
    coverage: ['lib', 'src/**/*.js']
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
        'dist/quill.base.css': ['dist/quill.base.css']
        'dist/quill.snow.css': ['dist/quill.snow.css']
  )

  grunt.config('lodash',
    options:
      modifier: 'modern'
      include: [
        'difference', 'intersection', 'last'
        'all', 'each', 'find', 'invoke', 'map', 'reduce', 'partition',
        'bind', 'defer', 'partial'
        'clone', 'extend', 'defaults', 'omit', 'values'
        'isElement', 'isEqual', 'isFunction', 'isNumber', 'isObject', 'isString'
        'uniqueId'
      ]
      flags: ['development']
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
        src: 'src/themes/*/*.styl'
        rename: (dest, src) ->
          return "dist/quill.#{src}"
      }]
  )

  grunt.config('uglify',
    quill:
      files: { 'dist/quill.min.js': ['dist/quill.js'] }
  )

