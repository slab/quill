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
)
