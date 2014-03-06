module.exports = (grunt) ->
  grunt.config('browserify', 
    options:
      alias: [
        'node_modules/eventemitter2/lib/eventemitter2.js:eventemitter2'
        'lib/linked_list.js:linked-list'
        'node_modules/tandem-core/build/tandem-core.js:tandem-core'
        'node_modules/underscore/underscore.js:underscore'
        'node_modules/underscore.string/lib/underscore.string.js:underscore.string'
      ]
      shim:
        'rangy-core':
          path: 'node_modules/rangy-browser/lib/rangy-core.js'
          exports: 'rangy'
      extensions: ['.js', '.coffee']
      standalone: 'Scribe'
      transform: ['coffeeify']
    scribe:
      files: [{ dest: 'build/scribe.js', src: ['index.coffee'] }]
  )

  grunt.config('clean', ['build'])

  grunt.config('coffee', 
    demo:
      expand: true
      dest: 'build/'
      src: ['demo/scripts/*.coffee']
      ext: '.js'
    test:
      files: [{
        'build/tests/mocha/editor.js': ['tests/mocha/lib/test.coffee', 'tests/mocha/lib/suite.coffee', 'tests/mocha/editor.coffee']
        'build/tests/mocha/unit.js': ['tests/mocha/lib/test.coffee', 'tests/mocha/lib/suite.coffee', 'tests/mocha/unit/*.coffee', 'tests/mocha/unit/modules/*.coffee']
        'build/tests/webdriver/scribedriver.js': 'tests/webdriver/lib/scribedriver.coffee'
      }]
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

