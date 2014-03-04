pjson = require('./package.json')


module.exports = (grunt) ->

  grunt.loadNpmTasks('grunt-browserify')
  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-contrib-coffee')
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-contrib-concat')
  grunt.loadNpmTasks('grunt-contrib-jade')
  grunt.loadNpmTasks('grunt-contrib-stylus')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-image-embed')
  grunt.loadNpmTasks('grunt-karma')
  grunt.loadNpmTasks('grunt-string-replace')

  # Project configuration.
  grunt.initConfig
    meta:
      version: pjson.version

    browserify:
      options:
        alias: ['node_modules/tandem-core/build/tandem-core.js:tandem-core']
        extensions: ['.js', '.coffee']
        transform: ['coffeeify']
      scribe:
        files: [{ dest: 'build/scribe.js', src: ['index.coffee'] }]
      tandem_wrapper:
        files: [{ dest: 'build/lib/tandem-core.js', src: ['tests/mocha/tandem.coffee'] }]
      
    clean: ['build', '*.log']

    coffee:
      demo:
        expand: true
        dest: 'build/'
        src: ['demo/scripts/*.coffee']
        ext: '.js'
      src:
        options:
          bare: true
        expand: true  
        ext: '.js'
        dest: 'build/'
        src: ['index.coffee', 'src/**/*.coffee', 'tests/karma/inject.coffee', 'tests/karma/*-fix.coffee']
      test:
        files: [{
          'build/tests/mocha/editor.js': ['tests/mocha/lib/test.coffee', 'tests/mocha/lib/suite.coffee', 'tests/mocha/editor.coffee']
          'build/tests/mocha/unit.js': ['tests/mocha/lib/test.coffee', 'tests/mocha/lib/suite.coffee', 'tests/mocha/unit/*.coffee', 'tests/mocha/unit/modules/*.coffee']
          'build/tests/webdriver/scribedriver.js': 'tests/webdriver/lib/scribedriver.coffee'
        }]

    concat:
      options:
        banner:
          '/*! Stypi Editor - v<%= meta.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
          ' *  https://www.stypi.com/\n' +
          ' *  Copyright (c) <%= grunt.template.today("yyyy") %>\n' +
          ' *  Jason Chen, Salesforce.com\n' +
          ' */\n\n'
      scribe_all:
        files: [{
          'build/scribe.all.js': [
            'node_modules/underscore/underscore.js'
            'node_modules/underscore.string/lib/underscore.string.js'
            'build/lib/rangy-core.js'
            'build/lib/eventemitter2.js'
            'build/lib/linked_list.js'
            'build/src/ext/header.js'
            'build/scribe.js'
            'build/src/ext/footer.js'
          ]
        }]
      scribe:
        files: [{ 'build/scribe.js': ['build/scribe.js'] }]

    copy:
      build:
        expand: true
        dest: 'build/'
        src: ['src/ext/*.js', 'tests/lib/*.js', 'demo/scripts/dropkick.js', 'demo/images/*.png', 'demo/fonts/*']
      node_modules:
        expand: true, flatten: true, cwd: 'node_modules/'
        dest: 'build/lib/'
        src: ['async/lib/async.js', 'mocha/mocha.css', 'mocha/mocha.js', 'underscore/underscore.js', 'underscore.string/lib/underscore.string.js']
      expectjs:
        dest: 'build/lib/expect.js'
        src:  'node_modules/expect.js/index.js'
      lib:
        expand: true, cwd: 'lib/'
        dest: 'build/lib/'
        src: ['*.js']

    imageEmbed:
      all:
        dest: ''
        expand: true
        src: ['build/demo/styles/*.css', 'build/tests/mocha/*.css']

    jade:
      all:
        options:
          pretty: true
        dest: 'build/'
        expand: true
        ext: ['.html']
        src: ['demo/*.jade', 'tests/**/*.jade', '!demo/content.jade']

    'string-replace':
      src:
        options:
          replacements: [{
            pattern: /.+ = require\(.+\);\n\n/g
            replacement: ''
          }, {
            pattern: /^var .+;\n\n/g
            replacement: ''
          }, {
            pattern: /^var [A-Za-z].+,\n/g
            replacement: 'var'
          }]
        expand: true
        dest: ''
        src: ['build/src/**/*.js']

    stylus:
      all:
        expand: true
        dest: 'build/'
        ext: ['.css']
        src: ['demo/styles/*.styl', 'tests/mocha/*.styl']

    karma:
      options:
        configFile: 'tests/karma/karma.conf.coffee'
        exclude: ['tests/mocha/editor.js']
        singleRun: true
      karma:
        singleRun: false
      unit:
        browsers: ['PhantomJS']
      exhaust:
        exclude: ['tests/mocha/unit.js']
        browsers: ['PhantomJS']
      local:
        browsers: ['Chrome', 'Firefox', 'Safari']
      'remote-mac':
        browsers: ['mac-chrome', 'mac-firefox', 'mac-safari']
        reporters: 'dots'
      'remote-windows':
        browsers: ['windows-chrome', 'windows-firefox', 'windows-ie-11']
        reporters: 'dots'
      'remote-legacy':
        browsers: ['windows-ie-10', 'windows-ie-9', 'windows-ie-8']
        reporters: 'dots'
      'remote-linux':
        browsers: ['linux-chrome', 'linux-firefox']
        reporters: 'dots'
      'remote-mobile':
        browsers: ['ipad', 'iphone']      # Testing on android is currently too slow
        reporters: 'dots'

    watch:
      'coffee-demo':
        files: ['demo/scripts/*.coffee']
        tasks: ['coffee:demo']
      'coffee-src':
        files: ['index.coffee', 'src/**/*.coffee']
        tasks: ['coffee:src', 'string-replace', 'browserify', 'concat']
      'coffee-test':
        files: ['tests/mocha/**/*.coffee']
        tasks: ['coffee:test']
      jade:
        files: ['demo/*.jade', 'tests/**/*.jade', '!demo/content.jade']
        tasks: ['jade']
      stylus:
        files: ['demo/styles/*.styl', 'tests/mocha/*.styl']
        tasks: ['stylus', 'imageEmbed']


  grunt.event.on('watch', (action, filepath) ->
    if grunt.file.isMatch(grunt.config('watch.coffee-demo.files'), filepath)
      grunt.config('coffee.demo.src', filepath)
    else if grunt.file.isMatch(grunt.config('watch.coffee-src.files'), filepath)
      grunt.config('coffee.src.src', filepath)
    else if grunt.file.isMatch(grunt.config('watch.jade.files'), filepath)
      grunt.config('jade.all.src', filepath)
    else if grunt.file.isMatch(grunt.config('watch.stylus.files'), filepath)
      grunt.config('stylus.all.src', filepath)
  )

  grunt.registerTask('default', ['clean', 'coffee', 'copy', 'string-replace', 'browserify', 'concat', 'jade', 'stylus', 'imageEmbed'])

  grunt.registerTask('test', ['karma:unit'])
  grunt.registerTask('test:karma', ['karma:karma'])
  grunt.registerTask('test:exhaust', ['karma:exhaust'])
  grunt.registerTask('test:local', ['karma:local'])
  grunt.registerTask('test:remote', ['karma:remote-mac', 'karma:remote-windows', 'karma:remote-linux', 'karma:remote-mobile', 'karma:remote-legacy'])
