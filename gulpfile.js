var babelify = require('babelify');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var del = require('del');
var derequire = require('gulp-derequire');
var flatten = require('gulp-flatten');
var pkg = require('./package.json');
var gulp = require('gulp');
var gutil = require('gulp-util');
var gzip = require('gulp-gzip');
var header = require('gulp-header');
var jade = require('gulp-jade');
var rename = require('gulp-rename');
var runsequence = require('run-sequence');
var source = require('vinyl-source-stream');
var stylus = require('gulp-stylus');
var tar = require('gulp-tar');
var uglify = require('gulp-uglify');
var watchify = require('watchify');

var BANNER =
  '/*! Quill Editor v${pkg.version}\n' +
  ' *  https://quilljs.com/\n' +
  ' *  Copyright (c) 2014, Jason Chen\n' +
  ' *  Copyright (c) 2013, salesforce.com\n' +
  ' */\n\n';


var b = browserify({
  entries: './src/index.js',
  noParse: [
    './node_modules/clone/clone.js',
    './node_modules/deep-equal/index.js',
    './node_modules/eventemitter3/index.js',
    './node_modules/extend/index.js',
    './node_modules/parchment/dist/parchment.js'
  ],
  standalone: 'Quill',
  transform: [babelify]
});
b.on('update', bundle);
b.on('log', gutil.log);
function bundle() {
  return b.bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('quill.js'))
    .pipe(buffer())
    .pipe(derequire())
    .pipe(gulp.dest('dist'));
}

gulp.task('default', ['build']);
gulp.task('dist', ['build', 'minify', 'theme', 'banner']);
gulp.task('examples', ['examples:styles', 'examples:html', 'examples:scripts'])
gulp.task('release', function(callback) {
  runsequence(
    'clean',
    ['dist', 'copy:build', 'examples'],
    'compress'
  , callback);
});


gulp.task('build', bundle);

gulp.task('minify', ['build'], function() {
  return gulp.src('dist/quill.js')
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest('dist'));
});

gulp.task('theme', function() {
  return gulp.src('src/themes/*/*.styl')
    .pipe(stylus())
    .pipe(rename({ prefix: 'quill.' }))
    .pipe(flatten())
    .pipe(gulp.dest('dist'));
});


gulp.task('examples:styles', function() {
  return gulp.src('examples/styles/*.styl')
    .pipe(stylus())
    .pipe(gulp.dest('.build/quill/examples/styles/'));
});

gulp.task('examples:html', function() {
  return gulp.src('examples/*.jade')
    .pipe(jade())
    .pipe(gulp.dest('.build/quill/examples/'));
});

gulp.task('examples:scripts', function() {
  return gulp.src('examples/scripts/*.js')
    .pipe(gulp.dest('.build/quill/examples/scripts/'));
});


gulp.task('clean', function() {
  return del(['.build', 'dist']);
});

gulp.task('copy:build', ['dist'], function() {
  return gulp.src('dist/*')
    .pipe(gulp.dest('.build/quill'));
});

gulp.task('banner', ['build', 'minify', 'theme'], function() {
  return gulp.src('dist/*')
    .pipe(header(BANNER, { pkg: pkg }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('compress', function() {
  return gulp.src('.build/quill/*')
    .pipe(tar('quill.tar'))
    .pipe(gzip())
    .pipe(gulp.dest('.build/'));
});
