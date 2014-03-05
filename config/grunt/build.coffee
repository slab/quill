module.exports = (grunt) ->
  grunt.config('browserify', 
    options:
      alias: ['node_modules/tandem-core/build/tandem-core.js:tandem-core']
      extensions: ['.js', '.coffee']
      transform: ['coffeeify']
    scribe:
      files: [{ dest: 'build/scribe.js', src: ['index.coffee'] }]
    tandem_wrapper:
      files: [{ dest: 'build/lib/tandem-core.js', src: ['tests/mocha/tandem.coffee'] }]
  )

  grunt.config('clean', ['build', '*.log'])

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
        ' *  https://www.stypi.com/\n' +
        ' *  Copyright (c) <%= grunt.template.today("yyyy") %>\n' +
        ' *  Jason Chen, Salesforce.com\n' +
        ' */\n\n'
    scribe_all:
      files: [{
        'build/scribe.all.js': [
          'node_modules/underscore/underscore.js'
          'node_modules/underscore.string/lib/underscore.string.js'
          'build/lib/rangy-core.js'
          'build/lib/eventemitter2.js'
          'build/lib/linked_list.js'
          'build/src/ext/header.js'
          'build/scribe.js'
          'build/src/ext/footer.js'
        ]
      }]
    scribe:
      files: [{ 'build/scribe.js': ['build/scribe.js'] }]
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

  grunt.config('string-replace', 
    src:
      options:
        replacements: [{
          pattern: /.+ = require\(.+\);\n\n/g
          replacement: ''
        }, {
          pattern: /^var .+;\n\n/g
          replacement: ''
        }, {
          pattern: /^var [A-Za-z].+,\n/g
          replacement: 'var'
        }]
      expand: true
      dest: ''
      src: ['build/src/**/*.js']
  )

  grunt.config('stylus',
    all:
      expand: true
      dest: 'build/'
      ext: ['.css']
      src: ['demo/styles/*.styl', 'tests/mocha/*.styl']
  )

