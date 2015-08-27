Delta = require('rich-text/lib/delta')
Editor = require('../../../../src/editor')


describe('Block', ->
  it('definition', ->
    @container.innerHTML = '\
      <h1>0</h1>\
      <h2>2</h2>\
      <h3>4</h3>\
      <ul>\
        <li>6</li>\
      </ul>\
      <ol>\
        <li>8</li>\
      </ol>'
    editor = new Editor(@container)
    expect(editor.getDelta()).toEqualDelta(new Delta()
      .insert('0')
      .insert('\n', { header: 1 })
      .insert('2')
      .insert('\n', { header: 2 })
      .insert('4')
      .insert('\n', { header: 3 })
      .insert('6')
      .insert('\n', { bullet: true })
      .insert('8')
      .insert('\n', { list: true })
    )
  )
)
