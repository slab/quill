describe('Base Theme', ->
  it('objToCss()', ->
    css = Quill.Theme.Base.objToCss(
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
)
