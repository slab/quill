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

      'src/debug.js'
      'src/document.js'
      'src/dom.js'
      'src/editor.js'
      'src/format.js'
      'tests/karma/format-fix.js'
      'src/format-manager.js'
      'src/keyboard.js'
      'src/leaf-iterator.js'
      'src/leaf.js'
      'src/line.js'
      'src/normalizer.js'
      'src/paste-manager.js'
      'src/position.js'
      'src/range.js'
      'src/renderer.js'
      'src/selection.js'
      'src/undo-manager.js'
      'src/utils.js'
      'src/modules/attribution.js'
      'src/modules/link-tooltip.js'
      'src/modules/multi-cursor.js'
      'src/modules/toolbar.js'

      'tests/mocha/unit.js'
      'tests/mocha/editor.js'
    ]
    exclude: []
    coverageReporter: 
      type: 'html'
      dir: '../coverage/'
    reporters: ['progress']
    preprocessors: 
      'src/**/*.js': ['coverage']
      '**/*.html': ['html2js']
    port: 9876
    colors: true
    logLevel: config.LOG_INFO
    autoWatch: false
    browsers: ['Chrome', 'Firefox', 'Safari']
    captureTimeout: 60000
    singleRun: true
  )
