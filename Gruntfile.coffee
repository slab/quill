module.exports = (grunt) ->

  grunt.loadNpmTasks 'grunt-coffeeify'
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-copy'
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-jade'
  grunt.loadNpmTasks 'grunt-contrib-stylus'
  grunt.loadNpmTasks 'grunt-contrib-watch'

  # Project configuration.
  grunt.initConfig
    meta:
      version: '0.9.0'

    clean: ['build']

    coffee:
      demo:
        expand: true
        dest: 'build/'
        src: ['demo/scripts/*.coffee']
        ext: '.js'
      test:
        files: [{
          dest: 'build/tests/karma/inject.js'
          src: 'tests/karma/inject.coffee'
        }, {
          dest: 'build/tests/mocha/editor.js'
          src: ['tests/mocha/lib/test.coffee', 'tests/mocha/lib/suite.coffee', 'tests/mocha/editor.coffee']
        }, {
          dest: 'build/tests/mocha/unit.js'
          src: ['tests/mocha/lib/test.coffee', 'tests/mocha/lib/suite.coffee', 'tests/mocha/unit/*.coffee', 'tests/mocha/unit/modules/*.coffee']
        }, {
          dest: 'build/tests/webdriver/scribedriver.js',
          src: 'tests/webdriver/lib/scribedriver.coffee'
        }]

    coffeeify:
      options:
        extensions: ['.js', '.coffee']
        requires: ['tandem-core']
      scribe:
        files: [{ dest: 'build/scribe.js', src: ['index.coffee'] }]
      scribe_exposed:
        files: [{ dest: 'build/scribe-exposed.js', src: ['tests/mocha/scribe-exposed.coffee'] }]
      tandem_wrapper:
        files: [{ dest: 'build/lib/tandem-core.js', src: ['tests/mocha/tandem.coffee'] }]

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
          dest: 'build/scribe.all.js'
          src: [
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
        files: ['src/**/*.coffee', 'node_modules/tandem-core/src/*']
        tasks: ['coffeeify', 'concat', 'copy:build']
      test:
        files: ['tests/mocha/**/*.coffee']
        tasks: ['coffee:test']

  # Default task.
  grunt.registerTask 'default', ['clean', 'coffee', 'copy', 'coffeeify', 'concat', 'jade', 'stylus']
