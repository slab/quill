var del = require('del');
var pkg = require('../package.json');
var gulp = require('gulp');
var gutil = require('gulp-util');
var header = require('gulp-header');
var rename = require('gulp-rename');
var stylus = require('gulp-stylus');
var tar = require('gulp-tar');
var uglify = require('gulp-uglify');
var webpack = require('webpack');
var webpackConfig = require('./webpack.conf');


var BANNER =
  '/*! Quill Editor v' + pkg.version + '\n' +
  ' *  https://quilljs.com/\n' +
  ' *  Copyright (c) 2014, Jason Chen\n' +
  ' *  Copyright (c) 2013, salesforce.com\n' +
  ' */\n\n';

var bannerPack = new webpack.BannerPlugin(BANNER, { raw: true });


module.exports = function(config) {
  gulp.task('source', function(callback) {
    webpackConfig.plugins.push(bannerPack);
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
    return gulp.src('assets/theme.styl')
      .pipe(stylus())
      .pipe(rename('quill.css'))
      .pipe(header(BANNER))
      .pipe(gulp.dest('dist/'));
  });

  gulp.task('clean', function() {
    return del(['dist']);
  });
};
