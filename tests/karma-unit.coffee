base = require('./karma-all')

module.exports = (config) ->
  base.call(this, config)
  config.set(
    exclude: ["tests/scripts/editor.js"]
  )
