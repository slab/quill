describe('Normalizer', ->
  beforeEach( ->
    @container = $('#test-container').html('').get(0)
  )

  describe('handleBreaks()', ->
    tests =
      'Break in middle of line':
        initial:  '<div><b>One<br>Two</b></div>'
        expected: '<div><b>One<br></b></div><div><b>Two</b></div>'
      'Break preceding line':
        initial:  '<div><b><br>One</b></div>'
        expected: '<div><b><br></b></div><div><b>One</b></div>'
      'Break after line':
        initial:  '<div><b>One<br></b></div>'
        expected: '<div><b>One<br></b></div>'

    _.each(tests, (test, name) ->
      it(name, ->
        @container.innerHTML = test.initial
        lineNode = Quill.Normalizer.handleBreaks(@container.firstChild)
        expect.equalHTML(@container, test.expected)
        expect(lineNode).to.equal(@container.firstChild)
      )
    )
  )

  describe('normalizeLine()', ->
    tests =
      'pull text node':
        initial:  '<div><div><span>A</span>B<div>C</div></div></div>'
        expected: '<div><span>A</span><span>B</span></div><div><div>C</div></div>'
      'inline with text':
        initial:  '<span>What</span>Test'
        expected: '<div><span>What</span><span>Test</span></div>'

    _.each(tests, (test, name) ->
      it(name, ->
        @container.innerHTML = test.initial
        lineNode = Quill.Normalizer.normalizeLine(@container.firstChild)
        expect.equalHTML(@container, test.expected)
        expect(lineNode).to.equal(@container.firstChild)
      )
    )
  )

  describe('normalizeNode()', ->
    it('should whitelist style and tag', ->
      @container.innerHTML = '<strong style="color: red; display: inline;">Test</strong>'
      Quill.Normalizer.normalizeNode(@container.firstChild)
      expect.equalHTML(@container, '<b style="color: red;">Test</b>')
    )
  )

  describe('pullBlocks()', ->
    tests =
      'No children':
        initial:  '<div></div>'
        expected: '<div></div>'
      'Inner block':
        initial:  '<div><div><span>Test</span></div><div><span>Another</span></div></div>'
        expected: '<div><span>Test</span></div><div><div><span>Another</span></div></div>'
      'Inner deep block':
        initial:  '<div><div><div><span>Test</span></div></div></div>'
        expected: '<div><span>Test</span></div>'
      'Inner deep recursive':
        initial:  '<div><div><div><div><span>Test</span><div>Test</div></div></div></div></div>'
        expected: '<div><span>Test</span></div><div><div>Test</div></div>'
      'Continuous inlines':
        initial:  '<div><span>A</span><br><span>B</span><div>Inner</div></div>'
        expected: '<div><span>A</span><br><span>B</span></div><div><div>Inner</div></div>'

    _.each(tests, (test, name) ->
      it(name, ->
        @container.innerHTML = test.initial
        firstChild = @container.firstChild
        Quill.Normalizer.pullBlocks(firstChild)
        expect.equalHTML(@container, test.expected)
        expect(firstChild).to.equal(@container.firstChild)
      )
    )
  )

  describe('stripWhitespace()', ->
    tests =
      'newlines':
        initial:
         '<div>
            <span>Test</span>
          </div>
          <div>
            <br>
          </div>'
        expected: '<div><span>Test</span></div><div><br></div>'
      'preceding and trailing spaces':
        initial:  '  <div></div>  '
        expected: '<div></div>'
      'inner spaces':
        initial:  '<div> <span> </span> <span>&nbsp; </span> </div>'
        expected: '<div><span></span><span>&nbsp; </span></div>'

    _.each(tests, (test, name) ->
      it(name, ->
        strippedHTML = Quill.Normalizer.stripWhitespace(test.initial)
        expect(strippedHTML).to.equal(test.expected)
      )
    )
  )

  describe('whitelistStyles()', ->
    tests =
      'no styles':
        initial:  '<div></div>'
        expected: '<div></div>'
      'no removal':
        initial:  '<div style="color: red;"></div>'
        expected: '<div style="color: red;"></div>'
      'removal':
        initial:  '<div style="color: red; display: inline;"></div>'
        expected: '<div style="color: red;"></div>'
      'remove default style':
        initial:  '<div style="color: #000;"></div>'
        expected: '<div></div>'
      'complete removal':
        initial:  '<div style="display: inline; cursor: pointer;"></div>'
        expected: '<div></div>'

    _.each(tests, (test, name) ->
      it(name, ->
        @container.innerHTML = test.initial
        Quill.Normalizer.whitelistStyles(@container.firstChild)
        expect.equalHTML(@container, test.expected)
      )
    )
  )

  describe('whitelistTags()', ->
    tests =
      'not element':
        initial:  'Test'
        expected: 'Test'
      'no switch needed':
        initial:  '<b>Bold</b>'
        expected: '<b>Bold</b>'
      'alias':
        initial:  '<strong>Bold</strong>'
        expected: '<b>Bold</b>'
      'switch inline':
        initial:  '<script>var test = "true";</script>'
        expected:  '<span>var test = "true";</span>'
      'switch block':
        initial:  '<h1>Test</h1>'
        expected: '<div>Test</div>'

    _.each(tests, (test, name) ->
      it(name, ->
        @container.innerHTML = test.initial
        Quill.Normalizer.whitelistTags(@container.firstChild)
        expect.equalHTML(@container, test.expected)
      )
    )
  )

  describe('wrapInline()', ->
    tests =
      'Wrap newline':
        initial:  ['<br>']
        expected: ['<div><br></div>']
      'Wrap span':
        initial:  ['<span>One</span>']
        expected: ['<div><span>One</span></div>']
      'Wrap many spans':
        initial: [
          '<span>One</span>'
          '<span>Two</span>'
        ]
        expected: [
          '<div><span>One</span><span>Two</span></div>'
        ]
      'Wrap break and span':
        initial:  ['<br><span>One</span>']
        expected: ['<div><br><span>One</span></div>']

    _.each(tests, (test, name) ->
      it(name, ->
        @container.innerHTML = test.initial.join('')
        Quill.Normalizer.wrapInline(@container.firstChild)
        expect.equalHTML(@container, test.expected)
      )
    )
  )

  describe('wrapText()', ->
    tests =
      'inner text':
        initial:  '<span><span>Inner</span>Test</span>'
        expected: '<span><span>Inner</span><span>Test</span></span>'
      'multiple inner':
        initial:  '<span>Test<span>Test<span>Test</span></span></span>'
        expected: '<span><span>Test</span><span><span>Test</span><span>Test</span></span></span>'
      'text node':
        initial: 'Test'
        expected: '<span>Test</span>'

    _.each(tests, (test, name) ->
      it(name, ->
        @container.innerHTML = test.initial
        Quill.Normalizer.wrapText(@container)
        expect.equalHTML(@container, test.expected)
      )
    )

    it('should wrap multiple text nodes', ->
      @container.appendChild(@container.ownerDocument.createTextNode('A'))
      @container.appendChild(@container.ownerDocument.createTextNode('B'))
      Quill.Normalizer.wrapText(@container)
      expect.equalHTML(@container, '<span>A</span><span>B</span>')
    )
  )
)
