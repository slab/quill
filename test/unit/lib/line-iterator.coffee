describe('LineIterator', ->
  it('iterate over standard lines', ->
    container = $('#editor-container').html(Quill.Normalizer.stripWhitespace('
      <p id="line-1">Test</p>
      <p id="line-2"><br></p>
      <p id="line-3">Test</p>'
    )).get(0)

    iterator = new Quill.Lib.LineIterator(container)
    _.each([1..3], (i) ->
      line = iterator.next()
      idIndex = parseInt(line.id.slice('line-'.length))
      expect(idIndex).toEqual(i)
    )
    line = iterator.next()
    expect(line).toEqual(null)
  )

  it('iterate over lists', ->
    container = $('#editor-container').html(Quill.Normalizer.stripWhitespace('
      <p id="line-1">Test</p>
      <ul>
        <li id="line-2">One</li>
        <li id="line-3">Two</li>
      </ul>
      <ol>
        <li id="line-4">One</li>
        <li id="line-5">Two</li>
      </ol>'
    )).get(0)

    iterator = new Quill.Lib.LineIterator(container)
    _.each([1..5], (i) ->
      line = iterator.next()
      idIndex = parseInt(line.id.slice('line-'.length))
      expect(idIndex).toEqual(i)
    )
    line = iterator.next()
    expect(line).toEqual(null)
  )

  it('iterate over empty', ->
    container = $('#editor-container').html('').get(0)
    iterator = new Quill.Lib.LineIterator(container)
    line = iterator.next()
    expect(line).toEqual(null)
  )

  it('iterate with change', ->
    container = $('#editor-container').html('<div id="line-1">One</div><p id="line-2">Two</p>').get(0)
    iterator = new Quill.Lib.LineIterator(container)
    line = iterator.next()
    expect(line.id).toEqual('line-1')
    Quill.DOM.switchTag(container.lastChild, 'div')
    line = iterator.next()
    expect(line).not.toEqual(null)
  )
)
