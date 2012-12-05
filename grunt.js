/*global module:false*/
module.exports = function(grunt) {

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
    concat: {
      dist: {
        src: ['<banner:meta.banner>', 'bin/src/*.js'],
        dest: 'build/scribe.js'
      }
    },
    uglify: {}
  });

  // Default task.
  grunt.registerTask('default', 'concat');

};
