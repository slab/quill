module.exports = (grunt) ->
  grunt.config('browserify',
    options:
      alias: [
        'node_modules/eventemitter2/lib/eventemitter2.js:eventemitter2'
        'lib/linked_list.js:linked-list'
        'node_modules/lodash/lodash.js:lodash'
        'node_modules/tandem-core/build/tandem-core.js:tandem-core'
        'node_modules/underscore.string/lib/underscore.string.js:underscore.string'
      ]
      extensions: ['.js', '.coffee']
      transform: ['coffeeify']
      shim:
        'rangy-core':
          path: 'node_modules/rangy-browser/lib/rangy-core.js'
          exports: 'rangy'
      standalone: 'Scribe'
    scribe:
      files: [{ 'build/scribe.js': ['index.coffee'] }]
    exposed:
      files: [{ 'build/scribe.exposed.js': ['tests/scribe.coffee'] }]
    tests:
      options:
        alias: [
          'node_modules/expect.js/index.js:expect.js'
          'node_modules/tandem-core/build/tandem-core.js:tandem-core'
        ]
        shim: null
        standalone: null
      files: [{
        'build/tests/mocha/editor.js': ['tests/mocha/editor.coffee']
        'build/tests/mocha/unit.js': ['tests/mocha/unit/**/*.coffee']
      }]
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
      src: ['src/**/*.coffee', '!src/debug.coffee']
      ext: '.js'
  )

  grunt.config('concat',
    options:
      banner:
        '/*! Stypi Editor - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        ' *  https://stypi.github.io/scribe/\n' +
        ' *  Copyright (c) <%= grunt.template.today("yyyy") %>\n' +
        ' *  Jason Chen, Salesforce.com\n' +
        ' */\n\n'
    scribe:
      files: [{
        'build/scribe.js': ['build/scribe.js']
        'build/scribe.min.js': ['build/scribe.min.js']
      }]
  )

  grunt.config('copy'
    build:
      expand: true
      dest: 'build/'
      src: ['lib/*.js', 'demo/images/*.png', 'demo/fonts/*']
    expectjs:
      dest: 'build/lib/expect.js'
      src:  'node_modules/expect.js/index.js'
  )

  grunt.config('imageEmbed',
    all:
      dest: ''
      expand: true
      src: ['build/demo/styles/*.css', 'build/tests/**/*.css']
  )

  grunt.config('jade',
    all:
      options:
        pretty: true
      dest: 'build/'
      expand: true
      ext: ['.html']
      src: ['demo/*.jade', 'tests/**/*.jade', '!demo/content.jade']
  )

  grunt.config('stylus',
    options:
      compress: false
    all:
      expand: true
      dest: 'build/'
      ext: ['.css']
      src: ['demo/styles/*.styl', 'tests/**/*.styl']
  )

  grunt.config('uglify',
    scribe:
      files: { 'build/scribe.min.js': ['build/scribe.js'] }
  )

