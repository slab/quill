var _ = require('lodash');
var babelify = require('babelify');
var browserify = require('browserify');
var gutil = require('gulp-util');
var stylify = require('stylify');
var watchify = require('watchify');


module.exports = function(entry) {
  var opts = _.assign({}, watchify.args, {
    noParse: [
      './node_modules/clone/clone.js',
      './node_modules/deep-equal/index.js',
      './node_modules/eventemitter3/index.js',
      './node_modules/extend/index.js',
      './node_modules/parchment/dist/parchment.js'
    ],
    standalone: 'Quill',
    transform: [babelify, stylify]
  });
  var b = watchify(browserify(entry, opts));
  b.on('log', gutil.log.bind(gutil, '[browserify] '));
  b.bundleWithError = function(bundle) {
    return b.bundle().on('error', function(err) {
      gutil.log(gutil.colors.red('[browserify]', err.name, err.message));
      this.emit('end');
    });
  };
  return b;
}
