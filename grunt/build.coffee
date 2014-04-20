module.exports = (grunt) ->
  grunt.config('browserify',
    options:
      alias: [
        'node_modules/eventemitter2/lib/eventemitter2.js:eventemitter2'
        'node_modules/expect.js/index.js:expect.js'
        'node_modules/lodash/lodash.js:lodash'
        'node_modules/tandem-core/build/tandem-core.js:tandem-core'
        'node_modules/underscore.string/lib/underscore.string.js:underscore.string'
      ]
      browserifyOptions:
        extensions: ['.js', '.coffee']
      transform: ['coffeeify']
    'quill':
      options:
        bundleOptions:
          standalone: 'Quill'
      'files': [
        { 'build/quill.js': ['index.coffee'] }
        { 'build/quill.exposed.js': ['tests/quill.coffee'] }
      ]
    'tests':
      files: [
        { 'build/tests/mocha/editor.js': ['tests/mocha/editor.coffee'] }
        { 'build/tests/mocha/functional.js': ['tests/mocha/functional/**/*.coffee'] }
        { 'build/tests/mocha/unit.js': ['tests/mocha/unit/**/*.coffee'] }
      ]
    'quill-watchify':
      options:
        bundleOptions:
          standalone: 'Quill'
        keepAlive: true
        watch: true
      files: [{ 'build/quill.js': ['index.coffee'] }]
    'quill-exposed-watchify':
      options:
        bundleOptions:
          standalone: 'Quill'
        keepAlive: true
        watch: true
      files: [{ 'build/quill.exposed.js': ['tests/quill.coffee'] }]
  )

  grunt.config('clean',
    all: ['build']
    coverage: ['src/**/*.js']
  )

  grunt.config('coffee',
    all:
      expand: true
      dest: 'build/'
      src: ['demo/scripts/*.coffee', 'tests/**/*.coffee', '!tests/mocha/**/*.coffee']
      ext: '.js'
    coverage:
      expand: true
      dest: 'build/'
      src: ['src/**/*.coffee']
      ext: '.js'
  )

  grunt.config('concat',
    options:
      banner:
        '/*! Stypi Editor - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        ' *  https://quilljs.com/\n' +
        ' *  Copyright (c) <%= grunt.template.today("yyyy") %>\n' +
        ' *  Jason Chen, Salesforce.com\n' +
        ' */\n\n'
    quill:
      'build/quill.js': ['build/quill.js']
      'build/quill.min.js': ['build/quill.min.js']
  )

  grunt.config('copy'
    build:
      expand: true
      dest: 'build/'
      src: ['lib/*.js', 'demo/images/*.png']
    expectjs:
      dest: 'build/lib/expect.js'
      src:  'node_modules/expect.js/index.js'
  )

  grunt.config('jade',
    all:
      options:
        pretty: true
      dest: 'build/'
      expand: true
      ext: '.html'
      src: ['demo/*.jade', 'tests/**/*.jade', '!demo/content.jade']
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
          return "build/themes/quill.#{src}"
      }]
    all:
      expand: true
      ext: '.css'
      dest: 'build/'
      src: ['demo/styles/*.styl', 'tests/**/*.styl']
  )

  grunt.config('uglify',
    quill:
      files: { 'build/quill.min.js': ['build/quill.js'] }
  )

