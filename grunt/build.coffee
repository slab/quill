module.exports = (grunt) ->
  grunt.config('browserify',
    options:
      alias: [
        'node_modules/eventemitter2/lib/eventemitter2.js:eventemitter2'
        'dist/lodash.js:lodash'
        'node_modules/tandem-core/build/tandem-core.js:tandem-core'
        'node_modules/underscore.string/lib/underscore.string.js:underscore.string'
      ]
      browserifyOptions:
        extensions: ['.js', '.coffee']
      transform: ['coffeeify']
    'quill':
      options:
        bundleOptions:
          standalone: 'Quill'
      files: [
        { 'dist/quill.js': ['src/quill.coffee'] }
        { 'dist/quill.exposed.js': ['test/quill.coffee'] }
      ]
    'tandem':
      options:
        bundleOptions:
          standalone: 'Tandem'
      files: [{ 'dist/tandem-core.js': ['node_modules/tandem-core/index.js'] }]
    'quill-watchify':
      options:
        bundleOptions:
          standalone: 'Quill'
        keepAlive: true
        watch: true
      files: [{ 'dist/quill.js': ['src/quill.coffee'] }]
    'quill-exposed-watchify':
      options:
        bundleOptions:
          standalone: 'Quill'
        keepAlive: true
        watch: true
      files: [{ 'dist/quill.exposed.js': ['test/quill.coffee'] }]
  )

  grunt.config('clean',
    all: ['dist']
    coffee: ['lib']
    coverage: ['src/**/*.js']
  )

  grunt.config('coffee',
    all:
      expand: true
      dest: 'dist/'
      src: ['examples/scripts/*.coffee', 'test/**/*.coffee']
      ext: '.js'
    src:
      options:
        bare: true
      cwd: 'src/'
      dest: 'lib/'
      expand: true
      src: ['**/*.coffee']
      ext: '.js'
  )

  grunt.config('concat',
    options:
      banner:
        '/*! Stypi Editor - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        ' *  https://quilljs.com/\n' +
        ' *  Copyright (c) <%= grunt.template.today("yyyy") %>\n' +
        ' *  Jason Chen, Salesforce.com\n' +
        ' */\n\n'
    quill:
      'dist/quill.js': ['dist/quill.js']
      'dist/quill.min.js': ['dist/quill.min.js']
  )

  grunt.config('jade',
    all:
      options:
        pretty: true
      dest: 'dist/'
      expand: true
      ext: '.html'
      src: ['examples/*.jade', 'test/fixtures/*.jade']
  )

  grunt.config('lodash',
    options:
      modifier: 'modern'
      include: [
        'each', 'map', 'reduce'
      ]
      flags: ['debug']
    target:
      dest: 'dist/lodash.js'
  )

  grunt.config('stylus',
    options:
      compress: false
    themes:
      options:
        urlfunc: 'url'
      files: [{
        expand: true
        ext: '.css'
        flatten: true
        src: 'src/themes/**/*.styl'
        rename: (dest, src) ->
          return "dist/themes/quill.#{src}"
      }]
    static:
      expand: true
      ext: '.css'
      dest: 'dist/'
      src: ['examples/styles/*.styl', 'test/fixtures/*.styl']
  )

  grunt.config('uglify',
    quill:
      files: { 'dist/quill.min.js': ['dist/quill.js'] }
  )

