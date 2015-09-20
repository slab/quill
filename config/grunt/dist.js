var derequire = require('derequire/plugin');
var fs = require('fs');
var through = require('through');

var banner =
  '/*! Quill Editor v<%= pkg.version %>\n' +
  ' *  https://quilljs.com/\n' +
  ' *  Copyright (c) 2014, Jason Chen\n' +
  ' *  Copyright (c) 2013, salesforce.com\n' +
  ' */\n\n';

function versionify(file) {
  var data = '';
  function write(buf) {
    return data += buf;
  }
  function end() {
    if (file.indexOf('package.json') > -1) {
      var version = JSON.parse(data).version;
      this.queue(JSON.stringify({
        version: version
      }));
    } else {
      this.queue(data);
    }
    this.queue(null);
  }
  return through(write, end);
}

module.exports = function(grunt) {
  grunt.config('browserify', {
    quill: {
      options: {
        banner: banner.slice(0, banner.length - 1),
        browserifyOptions: {
          noParse: ['./node_modules/clone/clone.js', './node_modules/deep-equal/index.js', './node_modules/eventemitter3/index.js', './node_modules/extend/index.js'],
          standalone: 'Quill'
        },
        transform: ['babelify', 'stylify', versionify],
        plugin: [derequire]
      },
      files: {
        'dist/quill.js': ['src/index.js']
      }
    }
  });

  grunt.config('clean', {
    all: ['.build', 'dist'],
    coverage: ['lib']
  });

  grunt.config('babel', {
    quill: {
      cwd: 'src/',
      dest: 'lib/',
      expand: true,
      src: ['**/*.js'],
      ext: '.js'
    }
  });

  grunt.config('stylus', {
    options: {
      banner: banner,
      compress: false
    },
    themes: {
      options: {
        urlfunc: 'url'
      },
      files: [
        {
          expand: true,
          ext: '.css',
          flatten: true,
          src: 'src/themes/*/*.styl',
          rename: function(dest, src) {
            return "dist/quill." + src;
          }
        }
      ]
    }
  });

  grunt.config('uglify', {
    options: {
      banner: banner
    },
    quill: {
      files: {
        'dist/quill.min.js': ['dist/quill.js']
      }
    }
  });
};
