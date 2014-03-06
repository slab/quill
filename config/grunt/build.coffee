module.exports = (grunt) ->
  grunt.config('browserify', 
    options:
      alias: [
        'node_modules/eventemitter2/lib/eventemitter2.js:eventemitter2'
        'lib/linked_list.js:linked-list'
        'lib/rangy-core.js:rangy-core'
        'node_modules/tandem-core/build/tandem-core.js:tandem-core'
        'node_modules/underscore/underscore.js:underscore'
        'node_modules/underscore.string/lib/underscore.string.js:underscore.string'
      ]
      extensions: ['.js', '.coffee']
      transform: ['coffeeify']
    scribe:
      files: [{ dest: 'build/scribe.js', src: ['index.coffee'] }]
  )

  grunt.config('clean', ['build', '*.log', 'src/**/*.js'])

  grunt.config('coffee', 
    demo:
      expand: true
      dest: 'build/'
      src: ['demo/scripts/*.coffee']
      ext: '.js'
    src:
      options:
        bare: true
      expand: true  
      ext: '.js'
      dest: 'build/'
      src: ['index.coffee', 'src/**/*.coffee', 'tests/karma/inject.coffee', 'tests/karma/*-fix.coffee']
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
      src: ['src/ext/*.js', 'tests/lib/*.js', 'demo/scripts/dropkick.js', 'demo/images/*.png', 'demo/fonts/*']
    node_modules:
      expand: true, flatten: true, cwd: 'node_modules/'
      dest: 'build/lib/'
      src: ['async/lib/async.js', 'mocha/mocha.css', 'mocha/mocha.js', 'underscore/underscore.js', 'underscore.string/lib/underscore.string.js']
    expectjs:
      dest: 'build/lib/expect.js'
      src:  'node_modules/expect.js/index.js'
    lib:
      expand: true, cwd: 'lib/'
      dest: 'build/lib/'
      src: ['*.js']
  )

  grunt.config('imageEmbed', 
    all:
      dest: ''
      expand: true
      src: ['build/demo/styles/*.css', 'build/tests/mocha/*.css']
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
      src: ['demo/styles/*.styl', 'tests/mocha/*.styl']
  )

  grunt.config('uglify',
    scribe:
      files: { 'build/scribe.min.js': ['build/scribe.js'] }
  )

