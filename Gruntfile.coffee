module.exports = (grunt) ->

  grunt.loadNpmTasks 'grunt-coffeeify'
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-copy'
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-sass'
  grunt.loadNpmTasks 'grunt-contrib-watch'

  # Project configuration.
  grunt.initConfig
    meta:
      version: '0.2.0'

    clean: ['bin/**/*.js']

    coffee:
      demo:
        expand: true
        dest: 'bin/'
        src: ['demo/scripts/*.coffee']
        ext: '.js'
      fuzzer:
        files: [{ dest: 'bin/tests/scripts/fuzzer.js', src: 'tests/scripts/fuzzer.coffee' }]
      unit:
        files: [{ dest: 'bin/tests/scripts/unit.js', src: 'tests/scripts/unit/*.coffee' }]

    coffeeify:
      options:
        requires: ['tandem-core']
      src:
        files: [{ dest: 'build/scribe.js', src: ['src/scribe.coffee'] }]
      tandem_wrapper:
        files: [{ dest: 'bin/lib/tandem-core.js', src: ['tests/scripts/tandem.coffee'] }]
       
    concat:
      options:
        banner:
          '/*! Stypi Editor - v<%= meta.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
          ' *  https://www.stypi.com/\n' +
          ' *  Copyright (c) <%= grunt.template.today("yyyy") %>\n' +
          ' *  Jason Chen, Salesforce.com\n' +
          ' */\n\n'
      scribe:
        files: [{ 
          dest: 'build/scribe.js'
          src: [
            'vendor/assets/javascripts/rangy/*.js'
            'vendor/assets/javascripts/linked_list.js'
            'build/scribe.js'
          ]
        }]
      scribe_all:
        files: [{ 
          dest: 'build/scribe.all.js'
          src: [
            'node_modules/underscore/underscore.js',
            'vendor/assets/javascripts/rangy/*.js',
            'vendor/assets/javascripts/eventemitter2.js',
            'vendor/assets/javascripts/linked_list.js',
            'build/scribe.js'
          ]
        }]

    copy:
      bin:
        expand: true
        dest: 'bin/'
        src: ['tests/lib/*.js', 'demo/scripts/dropkick.js', 'demo/images/*.png']
      build:
        expand: true
        dest: 'bin/'
        src: ['build/*.js']
      node_modules:
        expand: true, flatten: true, cwd: 'node_modules/'
        dest: 'bin/lib/'
        src: ['chai/chai.js', 'mocha/mocha.css', 'mocha/mocha.js', 'underscore/underscore.js']
      lib:
        expand: true, cwd: 'vendor/assets/javascripts/'
        dest: 'bin/lib/'
        src: ['*.js', 'rangy/*.js']

    sass:
      demo:
        expand: true
        dest: 'bin/'
        src: ['demo/styles/*.sass']
        ext: ['.css']

    watch:
      demo:
        files: ['demo/scripts/*.coffee']
        tasks: ['coffee:demo']
      fuzzer:
        files: ['tests/scripts/fuzzer.coffee']
        tasks: ['coffee:fuzzer']
      src:
        files: ['src/*.coffee', 'node_modules/tandem-core/src/*']
        tasks: ['coffeeify:src', 'copy:build']
      unit:
        files: ['tests/scripts/unit/*.coffee']
        tasks: ['coffee:unit']

  # Default task.
  grunt.registerTask 'default', ['clean', 'coffee', 'coffeeify', 'concat', 'copy']
