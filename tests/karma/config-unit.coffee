base = require('./config-all')

module.exports = (config) ->
  base.call(this, config)
  config.set(
    exclude: ['tests/mocha/editor.js']
  )
