var gulp = require('gulp');
var runsequence = require('run-sequence');
var build = require('./config/build.js');
var server = require('./config/server.js');
var test = require('./config/test.js');


gulp.task('default', ['build']);

gulp.task('examples', ['examples:styles', 'examples:html', 'examples:scripts']);
gulp.task('build', ['source', 'theme', 'examples']);
gulp.task('npm', function(callback) {
  runsequence(
    'clean',
    ['source', 'theme'],
    'dist'
  , callback);
});
gulp.task('release', function(callback) {
  runsequence(
    'clean',
    'build',
    'minify',
    'dist',
    'compress'
  , callback);
});

gulp.task('test', ['test:unit']);
// gulp.task('test:unit', ['server', 'karma:test']);
// gulp.task('test:e2e', ['server', 'protractor:test']);
// gulp.task('test:coverage', ['server'])

gulp.task('dev', ['server:keepalive', 'test:server', 'watch']);
