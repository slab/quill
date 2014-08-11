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

  it('buildRoot()', ->
    root = Quill.Renderer.buildRoot(@container)
    expect(@container.querySelectorAll('iframe').length).toEqual(0)
    expect(@container.firstChild).toEqual(root)
    expect(root.innerHTML).toEqual('')
  )

  it('constructor', ->
    renderer = new Quill.Renderer(@container)
    expect(@container.querySelectorAll('iframe').length).toEqual(0)
    expect(renderer.root.id).not.toBe(null)
  )

  it('constructor with useIFrame', ->
    renderer = new Quill.Renderer(@container, useIFrame: true)
    expect(@container.querySelectorAll('iframe').length).toEqual(1)
    expect(renderer.root.id).not.toBe(null)
  )

  it('constructor with styles', (done) ->
    renderer = new Quill.Renderer(@container, {
      styles: { '.editor-container > div': { 'line-height': '25px' } }
    })
    renderer.root.innerHTML = '<div>Test</div>'
    _.defer( ->
      expect(renderer.root.firstChild.offsetHeight).toEqual(25)
      done()
    )
  )

  it('detached() with iframe', ->
    renderer = new Quill.Renderer(@container, useIFrame: true)
    expect(renderer.detached()).toBe(false)
    renderer.iframe.parentNode.removeChild(renderer.iframe)
    expect(renderer.detached()).toBe(true)
  )

  it('detached() without iframe', ->
    renderer = new Quill.Renderer(@container)
    expect(renderer.detached()).toBe(false)
    renderer.root.parentNode.removeChild(renderer.root)
    expect(renderer.detached()).toBe(true)
  )

  it('addStyles() object', (done) ->
    renderer = new Quill.Renderer(@container)
    renderer.root.innerHTML = '<div>Test</div>'
    renderer.addStyles({
      '.editor-container > div': { 'line-height': '25px' }
    })
    _.defer( ->
      expect(renderer.root.firstChild.offsetHeight).toEqual(25)
      done()
    )
  )

  it('addStyles() stylesheet', (done) ->
    renderer = new Quill.Renderer(@container)
    renderer.root.innerHTML = '<div>Test</div>'
    renderer.addStyles('/base/test/fixtures/style.css')
    interval = setInterval( ->
      if renderer.root.firstChild.offsetHeight == 25
        clearInterval(interval)
        done()
    , 100)
  )
)
