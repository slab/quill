window.Tandem ||= {}

window.Tandem.Debug = 
  getEditor: (editor) ->
    editor ||= Tandem.Editor.editors[0]
    return if _.isNumber(editor) then Tandem.Editor.editors[editor] else editor

  getHtml: (editor) ->
    editor = this.getEditor(editor)
    return editor.iframeDoc.body

  getDocument: (editor) -> 
    editor = this.getEditor(editor)
    return editor.doc

