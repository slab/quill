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
      version: '0.2.1'

    clean: ['build']

    coffee:
      demo:
        expand: true
        dest: 'build/'
        src: ['demo/scripts/*.coffee']
        ext: '.js'
      fuzzer:
        files: [{ dest: 'build/tests/scripts/fuzzer.js', src: 'tests/scripts/fuzzer.coffee' }]
      unit:
        files: [{ dest: 'build/tests/scripts/unit.js', src: 'tests/scripts/unit/*.coffee' }]

    coffeeify:
      options:
        requires: ['tandem-core']
      src:
        files: [{ dest: 'build/scribe.js', src: ['src/scribe.coffee'] }]
      tandem_wrapper:
        files: [{ dest: 'build/lib/tandem-core.js', src: ['tests/scripts/tandem.coffee'] }]
       
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
      build:
        expand: true
        dest: 'build/'
        src: ['tests/lib/*.js', 'demo/scripts/dropkick.js', 'demo/images/*.png']
      node_modules:
        expand: true, flatten: true, cwd: 'node_modules/'
        dest: 'build/lib/'
        src: ['chai/chai.js', 'mocha/mocha.css', 'mocha/mocha.js', 'underscore/underscore.js']
      lib:
        expand: true, cwd: 'vendor/assets/javascripts/'
        dest: 'build/lib/'
        src: ['*.js', 'rangy/*.js']

    haml:
      demo:
        expand: true
        dest: 'build/'
        src: ['demo/*.haml']
        ext: ['.html']
      tests:
        expand: true
        dest: 'build/'
        src: ['tests/*.haml']
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
      fuzzer:
        files: ['tests/scripts/fuzzer.coffee']
        tasks: ['coffee:fuzzer']
      haml_demo:
        files: ['demo/*.haml']
        tasks: ['haml:demo']
      haml_tests:
        files: ['tests/*.haml']
        tasks: ['haml:tests']
      sass:
        files: ['demo/styles/*.sass']
        tasks: ['sass:demo']
      src:
        files: ['src/*.coffee', 'node_modules/tandem-core/src/*']
        tasks: ['coffeeify:src', 'copy:build']
      unit:
        files: ['tests/scripts/unit/*.coffee']
        tasks: ['coffee:unit']

  # Default task.
  grunt.registerTask 'default', ['clean', 'coffee', 'coffeeify', 'concat', 'copy', 'haml', 'sass']
