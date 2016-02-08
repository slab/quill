var gulp = require('gulp');
var buildTasks = require('./config/build.js');
var testTasks = require('./config/test.js');


buildTasks();
testTasks();


gulp.task('default', ['build']);
gulp.task('build', ['source', 'assets']);

gulp.task('test', ['karma:test']);
// gulp.task('test:coverage', ['karma:coverage']);
