module.exports = (grunt) ->

  grunt.loadNpmTasks 'grunt-coffeeify'
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-copy'
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-haml'
  grunt.loadNpmTasks 'grunt-contrib-sass'
  grunt.loadNpmTasks 'grunt-contrib-watch'

  # Project configuration.
  grunt.initConfig
    meta:
      version: '0.8.0'

    clean: ['build']

    coffee:
      demo:
        expand: true
        dest: 'build/'
        src: ['demo/scripts/*.coffee']
        ext: '.js'
      test:
        files: [{
          dest: 'build/tests/scripts/editor.js'
          src: ['tests/scripts/test.coffee', 'tests/scripts/suite.coffee', 'tests/scripts/editor.coffee']
        }, {
          dest: 'build/tests/scripts/scribedriver.js'
          src: 'tests/webdriver/lib/scribedriver.coffee'
        }, {
          dest: 'build/tests/scripts/unit.js'
          src: ['tests/scripts/test.coffee', 'tests/scripts/suite.coffee', 'tests/scripts/unit/*.coffee', 'tests/scripts/unit/modules/*.coffee']
        }]

    coffeeify:
      options:
        extensions: ['.js', '.coffee']
        requires: ['tandem-core']
      scribe:
        files: [{ dest: 'build/scribe.js', src: ['index.coffee'] }]
      scribe_exposed:
        files: [{ dest: 'build/scribe-exposed.js', src: ['tests/scripts/scribe-exposed.coffee'] }]
      tandem_wrapper:
        files: [{ dest: 'build/lib/tandem-core.js', src: ['tests/scripts/tandem.coffee'] }]

    copy:
      build:
        expand: true
        dest: 'build/'
        src: ['src/ext/*.js', 'tests/lib/*.js', 'demo/scripts/dropkick.js', 'demo/images/*.png']
      node_modules:
        expand: true, flatten: true, cwd: 'node_modules/'
        dest: 'build/lib/'
        src: ['async/lib/async.js', 'expect.js/expect.js', 'mocha/mocha.css', 'mocha/mocha.js', 'underscore/underscore.js']
      lib:
        expand: true, cwd: 'vendor/assets/javascripts/'
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
            'vendor/assets/javascripts/rangy-core.js'
            'vendor/assets/javascripts/eventemitter2.js'
            'vendor/assets/javascripts/linked_list.js'
            'build/src/ext/header.js'
            'build/scribe.js'
            'build/src/ext/footer.js'
          ]
        }]

    haml:
      demo:
        expand: true
        dest: 'build/'
        src: ['demo/*.haml', '!demo/content.haml']
        ext: ['.html']
      tests:
        expand: true
        dest: 'build/'
        src: ['tests/*.haml', 'tests/testem/*.haml', 'tests/webdriver/*.haml', '!tests/mocha.haml']
        ext: ['.html']

    sass:
      demo:
        expand: true
        dest: 'build/'
        src: ['demo/styles/*.sass']
        ext: ['.css']

    watch:
      demo:
        files: ['demo/scripts/*.coffee']
        tasks: ['coffee:demo']
      haml_demo:
        files: ['demo/*.haml']
        tasks: ['haml:demo']
      haml_tests:
        files: ['tests/*.haml', 'tests/testem/*.haml']
        tasks: ['haml:tests']
      sass:
        files: ['demo/styles/*.sass']
        tasks: ['sass:demo']
      src:
        files: ['src/**/*.coffee', 'node_modules/tandem-core/src/*']
        tasks: ['coffeeify', 'concat', 'copy:build']
      test:
        files: ['tests/scripts/**/**/*.coffee']
        tasks: ['coffee:test']

  # Default task.
  grunt.registerTask 'default', ['clean', 'coffee', 'copy', 'coffeeify', 'concat', 'haml', 'sass']
