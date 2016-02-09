var del = require('del');
var pkg = require('../package.json');
var gulp = require('gulp');
var gutil = require('gulp-util');
var header = require('gulp-header');
var stylus = require('gulp-stylus');
var tar = require('gulp-tar');
var uglify = require('gulp-uglify');
var webpack = require('webpack');
var webpackConfig = require('./webpack.conf');


module.exports = function() {
  gulp.task('source', function(callback) {
    webpack(webpackConfig, function(err, stats) {
      var json = stats.toJson();
      (json.warnings || []).forEach(function(warning) {
        gutil.log(gutil.colors.yellow("[webpack] " + warning));
      });
      (json.errors || []).forEach(function(error) {
        gutil.log(gutil.colors.red("[webpack] " + error));
      });
      if (err) throw new gutil.PluginError('webpack', err);
      callback();
    });
  });

  gulp.task('assets', function() {
    return gulp.src('assets/quill.styl')
      .pipe(stylus())
      .pipe(header(BANNER))
      .pipe(gulp.dest('dist/'));
  });

  gulp.task('clean', function() {
    return del(['dist']);
  });
};
