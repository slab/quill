var gulp = require('gulp');
var runsequence = require('run-sequence');
var buildTasks = require('./config/build.js');
var serverTasks = require('./config/server.js');
var testTasks = require('./config/test.js');

var config = {
  serverPort: 9000,
  testPort: 9876
};
config.host = 'localhost:' + config.serverPort;

buildTasks(config);
serverTasks(config);
testTasks(config);


gulp.task('default', ['build']);
gulp.task('build', ['source', 'assets']);

gulp.task('test', ['karma:test']);
// gulp.task('test:coverage', ['karma:coverage']);

gulp.task('dev', function(callback) {
  runsequence(
    'build',
    ['watch', 'server', 'karma:server']
  , callback);
});
