describe('Toolbar', ->
  toolbarTests = new Scribe.Test.EditorTest(
    initial: '<div><span>one.com</span><b>Bold</b></div>'
  )

  afterEach( ->
    # Remove all listeners on format-container to reset toolbar
    html = $('#format-container').html()
    $('#format-container').html('').html(html)
  )

  toolbarTests.run('Apply button format',
    expected: '<div><b>one.comBold</b></div>'
    fn: (editor) ->
      toolbar = new Scribe.Toolbar('format-container', editor)
      editor.setSelection(new Scribe.Range(editor, 0, 7))
      $('#format-container .bold').trigger('click')
  )

  toolbarTests.run('Apply link format',
    expected: '<div><a href="http://one.com/" title="http://one.com/">one.com</a><b>Bold</b></div>'
    fn: (editor) ->
      toolbar = new Scribe.Toolbar('format-container', editor)
      editor.setSelection(new Scribe.Range(editor, 0, 7))
      $('#format-container .link').trigger('click')
  )
)
