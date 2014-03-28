ScribeEditorTest = require('../../lib/editor-test')


describe('Toolbar', ->
  toolbarTests = new ScribeEditorTest(
    initial: '<div><span>one.com</span><b>Bold</b></div>'
  )

  beforeEach( ->
    # Remove all listeners on format-container to reset toolbar
    html = $('#format-container').html()
    $('#format-container').html('').html(html)
  )

  toolbarTests.run('Apply button format',
    expected: '<div><b>one.comBold</b></div>'
    fn: (editor) ->
      editor.addModule('toolbar', { container: '#format-container' })
      editor.focus()
      editor.setSelection(new Scribe.Range(editor.editor.doc, 0, 7))
      $('#format-container .sc-bold').click()
  )

  toolbarTests.run('Apply link format',
    expected: '<div><a href="http://one.com" title="http://one.com">one.com</a><b>Bold</b></div>'
    fn: (editor) ->
      editor.addModule('toolbar', { container: '#format-container' })
      editor.focus()
      editor.setSelection(new Scribe.Range(editor.editor.doc, 0, 7))
      $('#format-container .sc-link').click()
  )
)
