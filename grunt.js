/*global module:false*/
module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Project configuration.
  grunt.initConfig({
    meta: {
      version: '0.1.0',
      banner: '/*! Stypi Editor - v<%= meta.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '* https://www.stypi.com/\n' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
        'Jason Chen, Salesforce.com */'
    },
    coffee: {
      'bin/demo/scripts/dual.js': 'demo/scripts/dual.coffee',
      'bin/demo/scripts/pretty.js': 'demo/scripts/pretty.coffee',
      'bin/demo/scripts/toggler.js': 'demo/scripts/toggler.coffee',
      'bin/src/scribe.js': 'src/*.coffee',
      'bin/tests/scripts/fuzzer.js': 'tests/scripts/fuzzer.coffee',
      'bin/tests/scripts/unit.js': 'tests/scripts/unit/*.coffee'
    },
    concat: {
      'bin/src/scribe.js': [
        '<banner:meta.banner>',
        'vendor/assets/javascripts/rangy/*.js',
        'vendor/assets/javascripts/eventemitter2.js',
        'vendor/assets/javascripts/linked_list.js',
        'vendor/assets/javascripts/tandem-core.js',
        'bin/src/scribe.js'
      ],
      'bin/src/scribe.all.js': [
        '<banner:meta.banner>',
        'node_modules/underscore/underscore.js',
        'vendor/assets/javascripts/rangy/*.js',
        'vendor/assets/javascripts/eventemitter2.js',
        'vendor/assets/javascripts/linked_list.js',
        'bin/src/scribe.js'
      ]
    },
    copy: {
      'bin/demo/scripts/dropkick.js': 'demo/scripts/dropkick.js',
      'bin/demo/images/': 'demo/images/*.png'
    }
  });

  // Default task.
  grunt.registerTask('default', 'coffee concat copy');

};
