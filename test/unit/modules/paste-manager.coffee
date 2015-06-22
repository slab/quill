describe('PasteManager', ->
  it('_paste()', (done) ->
    container = $('#editor-container').get(0)
    container.innerHTML = '
      <div>
        <div>0123</div>
      </div>'
    quill = new Quill(container.firstChild)
    pasteManager = quill.getModule('paste-manager')
    quill.setSelection(2, 2)
    pasteManager._paste()
    pasteManager.container.innerHTML = '
      <b>Pasted</b>
      <div style="text-align: right;">Text</div>
    '
    quill.on(Quill.events.TEXT_CHANGE, (delta) ->
      expect(delta).toEqualDelta(new Quill.Delta().retain(2).insert('Pasted', { bold: true }).insert('\nText'))
      _.defer( ->
        range = quill.getSelection()
        expect(range.start).toEqual(13)
        expect(range.end).toEqual(13)
        done()
      )
    )
  )

  it('optionally allows custom delta creation', (done) ->
    container = $('#editor-container').get(0)
    container.innerHTML = '
      <div>
        <div>0123</div>
      </div>'
    quill = new Quill(container.firstChild, {
      modules: {
        'paste-manager': {
          onConvert: ->
            new Quill.Delta().insert('something else', {
              italic: true
            })
        }
      }
    })
    pasteManager = quill.getModule('paste-manager')
    quill.setSelection(2, 2)
    pasteManager._paste()
    pasteManager.container.innerHTML = '
      <b>Pasted</b>
      <div style="text-align: right;">Text</div>
    '
    quill.on(Quill.events.TEXT_CHANGE, (delta) ->
      expect(delta).toEqualDelta(
        new Quill.Delta()
        .retain(2)
        .insert('something else', { italic: true })
      )
      _.defer( ->
        range = quill.getSelection()
        expect(range.start).toEqual(16)
        expect(range.end).toEqual(16)
        done()
      )
    )
  )
)
