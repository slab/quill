window.Tandem ||= {}

window.Tandem.Debug = 
  getEditor: (editor) ->
    editor ||= Tandem.Editor.editors[0]
    return if _.isNumber(editor) then Tandem.Editor.editors[editor] else editor

  getHtml: (editor) ->
    doc = this.getDocument(editor)
    return doc.root

  getDocument: (editor) -> 
    editor = this.getEditor(editor)
    return editor.doc

