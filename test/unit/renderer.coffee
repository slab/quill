describe('Renderer', ->
  beforeEach( ->
    @container = $('#editor-container').html('').get(0)
  )

  it('objToCss()', ->
    css = Quill.Renderer.objToCss(
      '.editor-container a':
        'font-style': 'italic'
        'text-decoration': 'underline'
      '.editor-container b':
        'font-weight': 'bold'
    )
    expect(css).toEqual([
      '.editor-container a { font-style: italic; text-decoration: underline; }'
      '.editor-container b { font-weight: bold; }'
    ].join('\n'))
  )

  it('buildFrame()', ->
    [root, iframe] = Quill.Renderer.buildFrame(@container)
    expect(@container.querySelectorAll('iframe').length).toEqual(1)
    expect(root.ownerDocument.body.firstChild).toEqual(root)
    expect(root.innerHTML).toEqual('')
  )

  it('constructor', ->
    renderer = new Quill.Renderer(@container)
    expect(@container.querySelectorAll('iframe').length).toEqual(1)
    expect(renderer.root.id).not.toBe(null)
  )

  it('constructor with styles', (done) ->
    renderer = new Quill.Renderer(@container, {
      styles: { '.editor-container > p': { 'line-height': '25px' } }
    })
    renderer.root.innerHTML = '<p>Test</p>'
    # Two defers since renderer itself defers
    _.defer( =>
      _.defer( =>
        expect(renderer.root.firstChild.offsetHeight).toEqual(25)
        done()
      )
    )
  )

  it('addStyles()', (done) ->
    renderer = new Quill.Renderer(@container)
    renderer.root.innerHTML = '<p>Test</p>'
    renderer.addStyles({
      '.editor-container > p': { 'line-height': '25px' }
    })
    # Two defers since renderer itself defers
    _.defer( =>
      _.defer( =>
        expect(renderer.root.firstChild.offsetHeight).toEqual(25)
        done()
      )
    )
  )
)
