module.exports = (grunt) ->

  grunt.loadNpmTasks 'grunt-browserify'
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-copy'
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-jade'
  grunt.loadNpmTasks 'grunt-contrib-stylus'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-string-replace'

  # Project configuration.
  grunt.initConfig
    meta:
      version: '0.9.2'

    browserify:
      options:
        alias: ['node_modules/tandem-core/src/tandem.coffee:tandem-core']
        extensions: ['.js', '.coffee']
        transform: ['coffeeify']
      scribe:
        files: [{ dest: 'build/scribe.js', src: ['index.coffee'] }]
      tandem_wrapper:
        files: [{ dest: 'build/lib/tandem-core.js', src: ['tests/mocha/tandem.coffee'] }]
      
    clean: ['build']

    coffee:
      demo:
        expand: true
        dest: 'build/'
        src: ['demo/scripts/*.coffee']
        ext: '.js'
      bare:
        options:
          bare: true
        expand: true  
        ext: '.js'
        dest: 'build/'
        src: ['src/**/*.coffee', 'tests/karma/inject.coffee', 'tests/karma/*-fix.coffee']
      test:
        files: [{
          'build/tests/mocha/editor.js': ['tests/mocha/lib/test.coffee', 'tests/mocha/lib/suite.coffee', 'tests/mocha/editor.coffee']
          'build/tests/mocha/unit.js': ['tests/mocha/lib/test.coffee', 'tests/mocha/lib/suite.coffee', 'tests/mocha/unit/*.coffee', 'tests/mocha/unit/modules/*.coffee']
          'build/tests/webdriver/scribedriver.js': 'tests/webdriver/lib/scribedriver.coffee'
        }]

    concat:
      options:
        banner:
          '/*! Stypi Editor - v<%= meta.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
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

    copy:
      build:
        expand: true
        dest: 'build/'
        src: ['src/ext/*.js', 'tests/lib/*.js', 'demo/scripts/dropkick.js', 'demo/images/*.png']
      node_modules:
        expand: true, flatten: true, cwd: 'node_modules/'
        dest: 'build/lib/'
        src: ['async/lib/async.js', 'expect.js/expect.js', 'mocha/mocha.css', 'mocha/mocha.js', 'underscore/underscore.js', 'underscore.string/lib/underscore.string.js']
      lib:
        expand: true, cwd: 'lib/'
        dest: 'build/lib/'
        src: ['*.js']

    jade:
      options:
        pretty: true
      demo:
        dest: 'build/'
        expand: true
        ext: ['.html']
        src: ['demo/*.jade', '!demo/content.jade']
      tests:
        dest: 'build/'
        expand: true
        ext: ['.html']
        src: ['tests/**/*.jade']

    'string-replace':
      tests:
        options:
          replacements: [{
            pattern: /.+ = require\(.+\);\n\n/g
            replacement: ''
          }, {
            pattern: /^var .+;\n\n/g
            replacement: ''
          }, {
            pattern: /^var .+,\n/g
            replacement: 'var'
          }]
        expand: true
        dest: ''
        src: ['build/src/**/*.js']

    stylus:
      demo:
        expand: true
        dest: 'build/'
        src: ['demo/styles/*.styl']
        ext: ['.css']
      tests:
        expand: true
        dest: 'build/'
        src: ['tests/mocha/*.styl']
        ext: ['.css']

    watch:
      demo:
        files: ['demo/scripts/*.coffee']
        tasks: ['coffee:demo']
      jade_demo:
        files: ['demo/*.jade']
        tasks: ['jade:demo']
      jade_test:
        files: ['tests/**/*.jade']
        tasks: ['jade:tests']
      stylus:
        files: ['demo/styles/*.styl']
        tasks: ['stylus:demo']
      src:
        files: ['index.coffee', 'src/**/*.coffee']
        tasks: ['browserify', 'coffee', 'string-replace', 'concat']
      test:
        files: ['tests/mocha/**/*.coffee']
        tasks: ['coffee:test']

  # Default task.
  grunt.registerTask 'default', ['clean', 'coffee', 'copy', 'string-replace', 'browserify', 'concat', 'jade', 'stylus']
