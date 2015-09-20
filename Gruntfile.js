var _ = require('lodash');
var fs = require('fs');
var browsers = require('./config/browsers');

var GRUNT_DIR = 'config/grunt';

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    port: 9000,
    karmaPort: 9876
  });

  if (grunt.option('host')) {
    grunt.config('baseUrl', "http://" + (grunt.option('host')) + "/");
  } else {
    grunt.config('baseUrl', "http://localhost:" + (grunt.config('port')) + "/");
  }

  fs.readdirSync(GRUNT_DIR).forEach(function(file) {
    require("./" + GRUNT_DIR + "/" + file)(grunt);
  });

  grunt.registerTask('dev', ['connect:server', 'karma:server']);

  grunt.registerTask('dist', ['clean', 'browserify', 'uglify', 'stylus']);
  grunt.registerTask('release', ['dist', 'examples', 'copy', 'compress']);

  grunt.registerTask('server', ['connect:server:keepalive']);

  grunt.registerTask('test', ['test:unit']);

  grunt.registerTask('test:unit', ['connect:server', 'karma:test']);
  grunt.registerTask('test:wd', ['connect:server', 'protractor:test']);
  grunt.registerTask('test:e2e', ['connect:server', 'protractor:e2e']);

  grunt.registerTask('test:coverage', [
    'coffee:quill', 'replace:istanbul', 'istanbul:instrument',
    'connect:server', 'karma:coverage', 'istanbul:report',
    'clean:coverage'
  ]);

  _.each(browsers, function(config, browser) {
    grunt.registerTask("travis:unit-" + browser, ['connect:server', "karma:" + browser]);
    grunt.registerTask("travis:wd-" + browser, ['connect:server', 'sauce_connect:quill', "protractor:wd-" + browser]);
    grunt.registerTask("travis:e2e-" + browser, ['connect:server', 'sauce_connect:quill', "protractor:e2e-" + browser]);
  });
};
