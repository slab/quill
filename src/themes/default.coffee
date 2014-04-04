class DefaultTheme
  @OPTIONS: {}

  constructor: (@quill, options) ->
    @editor = @quill.editor
    @editorContainer = @editor.root


module.exports = DefaultTheme
