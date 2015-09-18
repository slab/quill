var async = require('async');
var fs = require('fs');
var glob = require('glob');
var istanbul = require('istanbul');
var collector = new istanbul.Collector();
var reporter = new istanbul.Reporter(null, '.build/coverage/merged');

module.exports = function(grunt) {
  grunt.config('replace', {
    istanbul: {
      overwrite: true,
      src: ['lib/**/*.js'],
      replacements: [
        {
          from: /\n  extend = function\(child, parent\) \{ for \(var key in parent\) \{ /,
          to: function(match, index, full) {
            return match + '/* istanbul ignore next */ ';
          }
        }
      ]
    }
  });

  grunt.registerTask('istanbul:instrument', function() {
    grunt.util.spawn({
      cmd: './node_modules/.bin/istanbul',
      args: ['instrument', 'lib/', '-o', 'src/'],
      opts: {
        stdio: 'inherit'
      }
    }, this.async());
  });

  grunt.registerTask('istanbul:report', function() {
    var done = this.async();
    glob('.build/coverage/**/*.json', function(er, files) {
      async.each(files, function(file, callback) {
        fs.readFile(file, 'utf8', function(err, data) {
          collector.add(JSON.parse(data));
          callback();
        });
      }, function(err) {
        reporter.addAll(['html', 'text']);
        reporter.write(collector, false, done);
      });
    });
  });
};
