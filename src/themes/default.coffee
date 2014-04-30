class DefaultTheme
  @OPTIONS: {}

  constructor: (@quill) ->
    @editor = @quill.editor
    @editorContainer = @editor.root


module.exports = DefaultTheme
