Delta = require('rich-text/lib/delta')
Editor = require('../../../../src/editor')


describe('Formats', ->
  describe('Header', ->
    it('init', ->
      @container.innerHTML = '<h1>Header</h1><h2>Subheader</h2><h3>Subsubheader</h3>'
      editor = new Editor(@container)
      expect(editor.getDelta()).toEqualDelta(new Delta()
        .insert('Header')
        .insert('\n', { header: 1 })
        .insert('Subheader')
        .insert('\n', { header: 2 })
        .insert('Subsubheader')
        .insert('\n', { header: 3 })
      )
    )

    it('set', ->
      @container.innerHTML = '<p><em>0123</em></p>'
      editor = new Editor(@container)
      editor.formatAt(4, 1, 'header', 1)
      expect(editor.getDelta()).toEqualDelta(new Delta()
        .insert('0123', { italic: true })
        .insert('\n', { header: 1 })
      )
      expect(@container.innerHTML).toEqualHTML('<h1><em>0123</em></h1>')
    )

    it('remove', ->
      @container.innerHTML = '<h1><em>0123</em></h1>'
      editor = new Editor(@container)
      editor.formatAt(4, 1, 'header', false)
      expect(editor.getDelta()).toEqualDelta(new Delta()
        .insert('0123', { italic: true })
        .insert('\n')
      )
      expect(@container.innerHTML).toEqualHTML('<p><em>0123</em></p>')
    )

    it('change', ->
      @container.innerHTML = '<h1><em>0123</em></h1>'
      editor = new Editor(@container)
      editor.formatAt(4, 1, 'header', 2)
      expect(editor.getDelta()).toEqualDelta(new Delta()
        .insert('0123', { italic: true })
        .insert('\n', { header: 2 })
      )
      expect(@container.innerHTML).toEqualHTML('<h2><em>0123</em></h2>')
    )
  )
)