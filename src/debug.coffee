window.Tandem ||= {}

window.Tandem.Debug = 
  getHtml: (editor) ->
    editor || = Tandem.Editor.editors[0]
    if _.isNumber(editor)
      return Tandem.Editor.editors[editor].iframeDoc.body
    else
      return editor.iframeDoc.body
