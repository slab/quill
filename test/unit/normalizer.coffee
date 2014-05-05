describe('Normalizer', ->
  beforeEach( ->
    @container = $('#editor-container').html('').get(0)
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
        expect(@container).toEqualHTML(test.expected)
        expect(lineNode).toEqual(@container.firstChild)
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
      'whitelist line node':
        initial:  '<p><span>Test</span></p>'
        expected: '<div><span>Test</span></div>'

    _.each(tests, (test, name) ->
      it(name, ->
        @container.innerHTML = test.initial
        lineNode = Quill.Normalizer.normalizeLine(@container.firstChild)
        expect(@container).toEqualHTML(test.expected)
        expect(lineNode).toEqual(@container.firstChild)
      )
    )
  )

  describe('normalizeNode()', ->
    it('whitelist style and tag', ->
      @container.innerHTML = '<strong style="color: red; display: inline;">Test</strong>'
      Quill.Normalizer.normalizeNode(@container.firstChild)
      expect(@container).toEqualHTML('<b style="color: red;">Test</b>')
    )

    it('convert size attribute', ->
      @container.innerHTML = '<font size="3">Test</font>'
      Quill.Normalizer.normalizeNode(@container.firstChild)
      expect(@container).toEqualHTML('<span style="font-size: 16px;">Test</span>')
    )
  )

  describe('optimizeLine()', ->
    tests =
      'unwrap non-format node':
        initial:  '<b><span>Test</span></b>'
        expected: '<b>Test</b>'
      'unwrap non-format node':
        initial:  '<span><b>Test</b></span>'
        expected: '<b>Test</b>'
      'preserve only span':
        initial:  '<span>Test</span>'
        expected: '<span>Test</span>'
      'remove unneeded break':
        initial:  '<span>Test</span><br>'
        expected: '<span>Test</span>'
      'preserve span with attributes':
        initial:  '<span class="custom"><span id="span-1234">Test</span></span>'
        expected: '<span class="custom"><span id="span-1234">Test</span></span>'
      'unwrap zero length nodes':
        initial:  '<b></b>'
        expected: ''
      'unwrap eventually':
        initial:  '<b><i></i><s></s></b>'
        expected: ''
      'unwrap break on empty line':
        initial:  '<b><i><br></i></b>'
        expected: '<br>'
      'preserve break on empty line':
        initial:  '<b><i></i></b><br>'
        expected: '<br>'
      'unwrap eventually with break':
        initial:  '<b><i></i><s><br></s></b>'
        expected: '<br>'
      'merge similar nodes':
        initial:  '<b>A</b><b>B</b>'
        expected: '<b>AB</b>'
      'merge similar span nodes':
        initial:  '<span style="color: red;">A</span><span style="color: red;">B</span>'
        expected: '<span style="color: red;">AB</span>'
      'merge multiple criteria similar nodes':
        initial:  '<b style="color: red;">A</b><b style="color: red;">B</b>'
        expected: '<b style="color: red;">AB</b>'
      'merge similar nodes after unwrap':
        initial:  '<span><b>A</b></span><b>B</b>'
        expected: '<b>AB</b>'
      'merge recursive':
        initial:  '<s><b>A</b></s><s><b>B</b></s>'
        expected: '<s><b>AB</b></s>'
      'preserve close but not same nodes':
        initial:  '<b style="color: red;">A</b><b style="color: blue;">B</b>'
        expected: '<b style="color: red;">A</b><b style="color: blue;">B</b>'
      'preserve similar images':
        initial:  '<img src="http://quilljs.com/images/icon.png"><img src="http://quilljs.com/images/icon.png">'
        expected: '<img src="http://quilljs.com/images/icon.png"><img src="http://quilljs.com/images/icon.png">'
      'wrap orphaned text node':
        initial:  '<s><b>0</b></s><s><span>1</span></s>'
        expected: '<s><b>0</b><span>1</span></s>'

    _.each(tests, (test, name) ->
      it(name, ->
        @container.innerHTML = "<div>#{test.initial}</div>"
        Quill.Normalizer.optimizeLine(@container.firstChild)
        expect(@container.firstChild).toEqualHTML(test.expected)
      )
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
        expect(@container).toEqualHTML(test.expected)
        expect(firstChild).toEqual(@container.firstChild)
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
        expect(strippedHTML).toEqual(test.expected)
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
      'complete removal':
        initial:  '<div style="display: inline; cursor: pointer;"></div>'
        expected: '<div></div>'

    _.each(tests, (test, name) ->
      it(name, ->
        @container.innerHTML = test.initial
        Quill.Normalizer.whitelistStyles(@container.firstChild)
        expect(@container).toEqualHTML(test.expected)
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
        initial:  '<abbr>A</abbr>'
        expected:  '<span>A</span>'
      'switch block':
        initial:  '<h1>Test</h1>'
        expected: '<div>Test</div>'

    _.each(tests, (test, name) ->
      it(name, ->
        @container.innerHTML = test.initial
        Quill.Normalizer.whitelistTags(@container.firstChild)
        expect(@container).toEqualHTML(test.expected)
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
        expect(@container).toEqualHTML(test.expected)
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
        expect(@container).toEqualHTML(test.expected)
      )
    )

    it('should wrap multiple text nodes', ->
      @container.appendChild(@container.ownerDocument.createTextNode('A'))
      @container.appendChild(@container.ownerDocument.createTextNode('B'))
      Quill.Normalizer.wrapText(@container)
      expect(@container).toEqualHTML('<span>A</span><span>B</span>')
    )
  )
)
