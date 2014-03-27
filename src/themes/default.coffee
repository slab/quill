class DefaultTheme
  @OPTIONS: {}

  constructor: (@scribe, options) ->
    @editor = @scribe.editor
    @editorContainer = @editor.root


module.exports = DefaultTheme
