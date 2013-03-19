module.exports = (grunt) ->

  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-copy'
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-uglify'

  # Project configuration.
  grunt.initConfig
    meta:
      version: '0.1.5'

    coffee:
      'bin/demo/scripts/*.js': 'demo/scripts/*.coffee'
      'bin/src/*.js': 'src/*.coffee'
      'bin/src/scribe.js': 'src/*.coffee'
      'bin/tests/scripts/fuzzer.js': 'tests/scripts/fuzzer.coffee'
      'bin/tests/scripts/unit.js': 'tests/scripts/unit/*.coffee'

    concat:
      banner: '/*! Stypi Editor - v<%= meta.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        ' *  https://www.stypi.com/\n' +
        ' *  Copyright (c) <%= grunt.template.today("yyyy") %>\n' +
        ' *  Jason Chen, Salesforce.com\n' +
        ' */'
      'bin/src/scribe.js': ['vendor/assets/javascripts/rangy/*.js','vendor/assets/javascripts/linked_list.js','bin/src/scribe.js']
      'bin/src/scribe.all.js': ['node_modules/underscore/underscore.js','vendor/assets/javascripts/rangy/*.js','vendor/assets/javascripts/eventemitter2.js','vendor/assets/javascripts/linked_list.js','vendor/assets/javascripts/tandem-core.js','bin/src/scribe.js']
    
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

    uglify:
      'build/scribe.min.js': 'bin/src/scribe.js',
      'build/scribe.all.min.js': 'bin/src/scribe.all.js'

  # Default task.
  grunt.registerTask 'default', ['coffee', 'concat', 'copy', 'uglify']
  grunt.registerTask 'dev', ['coffee', 'concat', 'copy']
