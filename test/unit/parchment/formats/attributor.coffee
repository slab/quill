Delta = require('rich-text/lib/delta')
Editor = require('../../../../src/editor')


describe('Attributor', ->
  it('add inline', ->
    @container.innerHTML = '<p>0123</p>'
    editor = new Editor(@container)
    editor.formatAt(1, 2, 'color', 'red')
    expect(editor.getDelta()).toEqualDelta(new Delta()
      .insert('0')
      .insert('12', { color: 'red' })
      .insert('3\n')
    )
    expect(@container.innerHTML).toEqualHTML('<p>0<span style="color: red;">12</span>3</p>')
  )

  it('add block', ->
    @container.innerHTML = '<p>0123</p>'
    editor = new Editor(@container)
    editor.formatAt(4, 1, 'align', 'center')
    expect(editor.getDelta()).toEqualDelta(new Delta()
      .insert('0123')
      .insert('\n', { align: 'center' })
    )
    expect(@container.innerHTML).toEqualHTML('<p style="text-align: center;">0123</p>')
  )

  it('default', ->
    @container.innerHTML = '<p style="text-align: center;">0123</p>'
    editor = new Editor(@container)
    editor.formatAt(4, 1, 'align', 'left')
    expect(editor.getDelta()).toEqualDelta(new Delta().insert('0123\n'))
    expect(@container.innerHTML).toEqualHTML('<p>0123</p>')
  )

  it('whitelist', ->
    @container.innerHTML = initial = '<p style="text-align: center;">0123</p>'
    editor = new Editor(@container)
    editor.formatAt(4, 1, 'align', 'middle')
    expect(editor.getDelta()).toEqualDelta(new Delta()
      .insert('0123')
      .insert('\n', { align: 'center' })
    )
    expect(@container.innerHTML).toEqualHTML(initial)
  )

  it('invalid block scope', ->
    @container.innerHTML = initial = '<p>0123</p>'
    editor = new Editor(@container)
    editor.formatAt(1, 2, 'align', 'center')
    expect(editor.getDelta()).toEqualDelta(new Delta().insert('0123\n'))
    expect(@container.innerHTML).toEqualHTML(initial)
  )

  it('invalid inline scope', ->
    @container.innerHTML = initial = '<p>0123</p>'
    editor = new Editor(@container)
    editor.formatAt(4, 1, 'color', 'red')
    expect(editor.getDelta()).toEqualDelta(new Delta().insert('0123\n'))
    expect(@container.innerHTML).toEqualHTML(initial)
  )
)
