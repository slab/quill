module.exports = (grunt) ->

  grunt.loadNpmTasks 'grunt-coffeeify'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-copy'
  grunt.loadNpmTasks 'grunt-contrib-concat'

  # Project configuration.
  grunt.initConfig
    meta:
      version: '0.2.0'

    coffee:
      multi:
        expand: true
        dest: 'bin/'
        src: ['src/*.coffee', 'demo/scripts/*.coffee']
        ext: '.js'
      single:
        files: [
          { dest: 'bin/tests/scripts/fuzzer.js', src: 'tests/scripts/fuzzer.coffee' }
          { dest: 'bin/tests/scripts/unit.js', src: 'tests/scripts/unit/*.coffee' }
        ]

    coffeeify:
      options:
        verbose: true
        requires: ['tandem-core']
      files:
        { dest: 'bin/src/scribe.js', src: ['src/scribe.coffee'] }

    concat:
      options:
        banner:
          '/*! Stypi Editor - v<%= meta.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
          ' *  https://www.stypi.com/\n' +
          ' *  Copyright (c) <%= grunt.template.today("yyyy") %>\n' +
          ' *  Jason Chen, Salesforce.com\n' +
          ' */\n\n'
      'bin/src/scribe.js': [
        'vendor/assets/javascripts/rangy/*.js',
        'vendor/assets/javascripts/linked_list.js',
        'bin/src/scribe.js'
      ]
      'bin/src/scribe.all.js': [
        'node_modules/underscore/underscore.js',
        'vendor/assets/javascripts/rangy/*.js',
        'vendor/assets/javascripts/eventemitter2.js',
        'vendor/assets/javascripts/linked_list.js',
        'bin/src/scribe.js'
      ]

    copy:
      'bin/demo/scripts/dropkick.js': 'demo/scripts/dropkick.js'
      'bin/demo/images/': 'demo/images/*.png'
      'bin/lib/chai.js': 'node_modules/chai/chai.js'
      'bin/lib/mocha.css': 'node_modules/mocha/mocha.css'
      'bin/lib/mocha.js': 'node_modules/mocha/mocha.js'
      'bin/lib/underscore.js': 'node_modules/underscore/underscore.js'
      'bin/lib/rangy/': 'vendor/assets/javascripts/rangy/*.js'
      'bin/lib/': 'vendor/assets/javascripts/*.js'
      'bin/tests/lib/': 'tests/lib/*.js'

  # Default task.
  grunt.registerTask 'default', ['coffee', 'coffeeify', 'concat', 'copy']
