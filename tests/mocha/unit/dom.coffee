describe('DOM', ->
  it('removeAttributes', ->
    span = document.createElement('span')
    span.setAttribute('data-test', 'test')
    span.setAttribute('width', '100px')
    expect(span.outerHTML).to.equal('<span data-test="test" width="100px"></span>')
    ScribeDOM.removeAttributes(span)
    expect(span.outerHTML).to.equal('<span></span>')
  )

  it('removeAttributes with exception', ->
    span = document.createElement('span')
    span.setAttribute('data-test', 'test')
    span.setAttribute('width', '100px')
    ScribeDOM.removeAttributes(span, 'width')
    expect(span.outerHTML).to.equal('<span width="100px"></span>')
  )
)
