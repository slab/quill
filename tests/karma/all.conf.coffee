module.exports = (config) ->
  config.set(
    basePath: '../../build'
    frameworks: ['mocha']
    files: [
      'http://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.js'
      'tests/mocha/style.css'
      
      'lib/underscore.js'
      'lib/underscore.string.js'
      'lib/eventemitter2.js'
      'lib/linked_list.js'
      'lib/rangy-core.js'
      'lib/tandem-core.js'
      'lib/expect.js'

      'tests/mocha/fixture.html'
      'tests/karma/inject.js'
      'tests/karma/module-fix.js'

      'src/modules/*.js'
      'src/themes/picker.js'
      'src/themes/*.js'

      'src/format.js'
      'tests/karma/format-fix.js'

      'src/*.js'

      'tests/mocha/unit.js'
      'tests/mocha/editor.js'
    ]
    exclude: []
    coverageReporter: 
      type: 'lcov'
      dir: '../coverage/'
    reporters: ['progress']
    preprocessors: 
      'src/!(debug).js': ['coverage']
      'src/modules/*.js': ['coverage']
      'src/themes/!(snow).js': ['coverage']
      '**/*.html': ['html2js']
    port: 9876
    colors: true
    logLevel: config.LOG_INFO
    autoWatch: false
    browsers: ['Chrome', 'Firefox', 'Safari']
    captureTimeout: 60000
    singleRun: true
  )
