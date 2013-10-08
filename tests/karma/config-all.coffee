module.exports = (config) ->
  config.set(
    basePath: '../../build'
    frameworks: ['mocha']
    files: [
      'http://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.js',
      'tests/mocha/style.css',
      'lib/underscore.js',
      'lib/underscore.string.js',
      'lib/eventemitter2.js',
      'lib/linked_list.js',
      'lib/rangy-core.js',
      'lib/tandem-core.js',
      'lib/expect.js',
      'scribe-exposed.js',

      'tests/mocha/fixture.html',
      'tests/karma/inject.js'

      'tests/mocha/unit.js'
      'tests/mocha/editor.js'
    ]
    exclude: []
    reporters: ['progress']
    port: 9876
    colors: true
    logLevel: config.LOG_INFO
    autoWatch: false
    browsers: ['Chrome', 'ChromeCanary', 'Firefox', 'Safari']
    captureTimeout: 60000
    singleRun: true
  )
