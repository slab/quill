describe('Toolbar', ->
  toolbarTests = new Scribe.Test.EditorTest(
    initial: '<div><span>One</span><b>Bold</b></div>'
  )

  toolbarTests.run('Apply button format',
    expected: '<div><b>OneBold</b></div>'
    fn: (editor) ->
      toolbar = new Scribe.Toolbar('format-container', editor)
      editor.setSelection(new Scribe.Range(editor, 0, 3))
      $('#format-container .bold').trigger('click')
  )
)
