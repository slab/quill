_     = require('lodash')
_.str = require('underscore.string')


class ScribeDefaultTheme
  @OPTIONS: {}

  constructor: (@scribe, options) ->
    @editor = @scribe.editor
    @editorContainer = @editor.root


module.exports = ScribeDefaultTheme
