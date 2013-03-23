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
        src: ['demo/scripts/*.coffee']
        ext: '.js'
      single:
        files: [
          { dest: 'bin/tests/scripts/fuzzer.js', src: 'tests/scripts/fuzzer.coffee' }
          { dest: 'bin/tests/scripts/unit.js', src: 'tests/scripts/unit/*.coffee' }
        ]

    coffeeify:
      options:
        requires: ['tandem-core']
      unit:
        expand: true, flatten: true
        dest: 'bin/src/'
        src: ['src/*.coffee']
        ext: '.js'
      unit_modules:
        expand: true, flatten: true
        ext: '.js'
        dest: 'bin/src/modules/'
        src: ['src/modules/*.coffee']
      src:
        files: [{ dest: 'build/scribe.js', src: ['src/scribe.coffee'] }]
          
    concat:
      options:
        banner: 
          '/*! Stypi Editor - v<%= meta.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
          ' *  https://www.stypi.com/\n' +
          ' *  Copyright (c) <%= grunt.template.today("yyyy") %>\n' +
          ' *  Jason Chen, Salesforce.com\n' +
          ' */\n\n'
      'build/scribe.js': [
        'vendor/assets/javascripts/rangy/*.js',
        'vendor/assets/javascripts/linked_list.js',
        'bin/src/scribe.js'
      ]
      'build/scribe.all.js': [
        'node_modules/underscore/underscore.js',
        'vendor/assets/javascripts/rangy/*.js',
        'vendor/assets/javascripts/eventemitter2.js',
        'vendor/assets/javascripts/linked_list.js',
        'build/scribe.js'
      ]
    
    copy:
      bin:
        expand: true
        dest: 'bin/'
        src: ['build/*.js', 'tests/lib/*.js', 'demo/scripts/dropkick.js', 'demo/images/*.png']
      node_modules:
        expand: true, flatten: true, cwd: 'node_modules/'
        dest: 'bin/lib/'
        src: ['chai/chai.js', 'mocha/mocha.css', 'mocha/mocha.js', 'underscore/underscore.js']
      lib:
        expand: true, cwd: 'vendor/assets/javascripts/'
        dest: 'bin/lib/'
        src: ['*.js', 'rangy/*.js']

  # Default task.
  grunt.registerTask 'default', ['coffee', 'coffeeify', 'concat', 'copy']
