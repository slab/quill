var del = require('del');
var flatten = require('gulp-flatten');
var pkg = require('../package.json');
var gulp = require('gulp');
var gutil = require('gulp-util');
var gzip = require('gulp-gzip');
var header = require('gulp-header');
var jade = require('gulp-jade');
var rename = require('gulp-rename');
var stylus = require('gulp-stylus');
var tar = require('gulp-tar');
var uglify = require('gulp-uglify');
var webpack = require('webpack');
var webpackConfig = require('./webpack.conf');

var BANNER =
  '/*! Quill Editor v${pkg.version}\n' +
  ' *  https://quilljs.com/\n' +
  ' *  Copyright (c) 2014, Jason Chen\n' +
  ' *  Copyright (c) 2013, salesforce.com\n' +
  ' */\n\n';

module.exports = function(config) {
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

  gulp.task('minify', function() {
    return gulp.src('.build/quill/quill.js')
      .pipe(uglify({
        banner: BANNER,
        compress: { screw_ie8: true },
        mangle: { screw_ie8: true }
      }))
      .pipe(rename({ extname: '.min.js' }))
      .pipe(gulp.dest('.build/quill/'));
  });

  gulp.task('theme', function() {
    return gulp.src('src/themes/*/*.styl')
      .pipe(stylus({ 'url': 'url' }))
      .pipe(rename({ prefix: 'quill.' }))
      .pipe(flatten())
      .pipe(gulp.dest('.build/quill/'));
  });

  gulp.task('examples', function() {
    return gulp.src('examples/*.jade')
      .pipe(jade({ pretty: true }))
      .pipe(gulp.dest('.build/quill/examples/'));
  });

  gulp.task('clean', function() {
    return del(['.build', 'dist']);
  });

  gulp.task('dist', function() {
    return gulp.src(['.build/quill/quill.js', '.build/quill/quill.*.css'])
      .pipe(header(BANNER, { pkg: pkg }))
      .pipe(gulp.dest('dist/'));
  });

  gulp.task('compress', function() {
    return gulp.src('.build/quill/*')
      .pipe(tar('quill.tar'))
      .pipe(gzip())
      .pipe(gulp.dest('.build/'));
  });
};
