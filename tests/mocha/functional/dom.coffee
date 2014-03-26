describe('DOM', ->
  it('removeAttributes', ->
    span = document.createElement('span')
    span.setAttribute('data-test', 'test')
    expect(span.outerHTML.toLowerCase()).to.equal('<span data-test="test"></span>')
    Scribe.DOM.removeAttributes(span)
    expect(span.outerHTML.toLowerCase()).to.equal('<span></span>')
  )

  it('removeAttributes with exception', ->
    span = document.createElement('span')
    span.setAttribute('data-test', 'test')
    span.setAttribute('width', '100px')
    Scribe.DOM.removeAttributes(span, 'width')
    expect(span.outerHTML.toLowerCase()).to.equal('<span width="100px"></span>')
  )
)
