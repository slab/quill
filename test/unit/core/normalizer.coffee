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
        ieOmit: true
      'Break after line':
        initial:  '<div><b>One<br></b></div>'
        expected: '<div><b>One<br></b></div>'

    _.each(tests, (test, name) ->
      return if test.ieOmit and Quill.Lib.DOM.isIE(10)
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
      'inline with text':
        initial:  '<span>What</span>Test'
        expected: '<div>WhatTest</div>'
      'whitelist line node':
        initial:  '<div>Test</div>'
        expected: '<div>Test</div>'
      'pull text node':
        initial:  '<div><div>AB<div>C</div></div></div>'
        expected: '<div>AB</div><div>C</div>'

    _.each(tests, (test, name) ->
      it(name, ->
        @container.innerHTML = test.initial
        @normalizer = new Quill.Normalizer()
        lineNode = @normalizer.normalizeLine(@container.firstChild)
        expect(@container).toEqualHTML(test.expected)
        expect(lineNode).toEqual(@container.firstChild)
      )
    )
  )

  describe('normalizeNode()', ->
    it('whitelist style and tag', ->
      @normalizer = new Quill.Normalizer()
      @normalizer.whitelist.tags.B = true
      @normalizer.whitelist.styles.color = true
      @container.innerHTML = '<strong style="color: red; display: inline;">Test</strong>'
      @normalizer.normalizeNode(@container.firstChild)
      expect(@container).toEqualHTML('<b style="color: red;">Test</b>')
    )

    it('convert size attribute', ->
      @normalizer = new Quill.Normalizer()
      @normalizer.whitelist.styles.fontSize = true
      @container.innerHTML = '<font size="3">Test</font>'
      @normalizer.normalizeNode(@container.firstChild)
      expect(@container).toEqualHTML('<span style="font-size: 16px;">Test</span>')
    )

    it('text node', ->
      @normalizer = new Quill.Normalizer()
      @container.innerHTML = 'Test'
      @normalizer.normalizeNode(@container.firstChild)
      expect(@container).toEqualHTML('Test')
    )
  )

  describe('optimizeLine()', ->
    tests =
      'remove unneeded break':
        initial:  'Test<br>'
        expected: 'Test'
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
      'merge recursive':
        initial:  '<s><b>A</b></s><s><b>B</b></s>'
        expected: '<s><b>AB</b></s>'
      'preserve close but not same nodes':
        initial:  '<b style="color: red;">A</b><b style="color: blue;">B</b>'
        expected: '<b style="color: red;">A</b><b style="color: blue;">B</b>'
      'preserve similar images':
        initial:  '<img src="http://quilljs.com/images/cloud.png"><img src="http://quilljs.com/images/cloud.png">'
        expected: '<img src="http://quilljs.com/images/cloud.png"><img src="http://quilljs.com/images/cloud.png">'
      'wrap orphaned text node':
        initial:  '<s><b>0</b></s><s><span>1</span></s>'
        expected: '<s><b>0</b><span>1</span></s>'
      'merge text nodes':
        initial:  'A <b></b> B.'
        expected:  'A  B.'

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
      'After block':
        initial:  '<div>One<div>Two</div></div>'
        expected: '<div>One</div><div>Two</div>'
      'Before inner block':
        initial:  '<div><div>One<div>Two</div></div></div>'
        expected: '<div>One</div><div>Two</div>'
      'After inner block':
        initial:  '<div><div><div>One</div>Two</div></div>'
        expected: '<div>One</div><div>Two</div>'
      'Middle block':
        initial:  '<div>One<div>Two</div>Three</div>'
        expected: '<div>One</div><div>Two</div><div>Three</div>'
      'Inner block':
        initial:  '<div><div>Test</div><div>Another</div></div>'
        expected: '<div>Test</div><div><div>Another</div></div>'
      'Inner deep block':
        initial:  '<div><div><div>Test</div></div></div>'
        expected: '<div>Test</div>'
      'Inner deep recursive':
        initial:  '<div><div><div><div>Test<div>Test</div></div></div></div></div>'
        expected: '<div>Test</div><div>Test</div>'
      'Continuous inlines':
        initial:  '<div>A<br>B<div>Inner</div></div>'
        expected: '<div>A<br>B</div><div>Inner</div>'
      'Bullets':
        initial:  '<ul><li>One</li><li>Two</li></ul>'
        expected: '<ul><li>One</li><li>Two</li></ul>'
      'Inner list':
        initial:  '<div><ul><li>One</li><li>Two</li></ul></div>'
        expected: '<ul><li>One</li><li>Two</li></ul>'
      'Middle list':
        initial:  '<div>Test<ul><li>One</li><li>Two</li></ul>Test</div>'
        expected: '<div>Test</div><ul><li>One</li><li>Two</li></ul><div>Test</div>'

    _.each(tests, (test, name) ->
      it(name, ->
        @container.innerHTML = test.initial
        firstChild = @container.firstChild
        Quill.Normalizer.pullBlocks(firstChild)
        expect(@container).toEqualHTML(test.expected)
      )
    )
  )

  describe('stripComments()', ->
    it('single line', ->
      html = '<div>Test</div><!-- Comment --><div>Test</div>'
      expect(Quill.Normalizer.stripComments(html)).toEqual('<div>Test</div><div>Test</div>')
    )

    it('multiple lines', ->
      html = "<div>Test</div>\n<!-- Comment \n More Comment -->\n<div>Test</div>"
      expect(Quill.Normalizer.stripComments(html)).toEqual("<div>Test</div>\n\n<div>Test</div>")
    )
  )

  describe('stripWhitespace()', ->
    tests =
      'newline between tags':
        initial:
         '<div>Test</div>
          <div>
            <br>
          </div>'
        expected: '<div>Test</div><div><br></div>'
      'newlines in text':
        initial: "<div>A\nB\r\nC\rD</div>"
        expected: "<div>A B C D</div>"
      'consecutive newlines in text':
        initial: "<div>A\n\nB\r\n\rC</div>"
        expected: "<div>A B C</div>"
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
    beforeEach( ->
      @normalizer = new Quill.Normalizer()
      @normalizer.whitelist.styles.color = true
    )

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
        @normalizer.whitelistStyles(@container.firstChild)
        expect(@container).toEqualHTML(test.expected)
      )
    )
  )

  describe('whitelistTags()', ->
    beforeEach( ->
      @normalizer = new Quill.Normalizer()
      @normalizer.whitelist.tags.B = true
    )

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
      'unwrap inline':
        initial:  '<abbr>A</abbr>'
        expected:  'A'
      'switch block':
        initial:  '<h1>Test</h1>'
        expected: '<div>Test</div>'

    _.each(tests, (test, name) ->
      it(name, ->
        @container.innerHTML = test.initial
        @normalizer.whitelistTags(@container.firstChild)
        expect(@container).toEqualHTML(test.expected)
      )
    )
  )

  describe('wrapInline()', ->
    tests =
      'Wrap newline':
        initial:  ['<br>']
        expected: ['<div><br></div>']
      'Wrap text':
        initial:  ['One']
        expected: ['<div>One</div>']
      'Wrap multiple':
        initial: [
          '<b>One</b>'
          '<s>Two</s>'
        ]
        expected: [
          '<div><b>One</b><s>Two</s></div>'
        ]
      'Wrap break and text':
        initial:  ['<br>One']
        expected: ['<div><br>One</div>']

    _.each(tests, (test, name) ->
      it(name, ->
        @container.innerHTML = test.initial.join('')
        Quill.Normalizer.wrapInline(@container.firstChild)
        expect(@container).toEqualHTML(test.expected)
      )
    )
  )

  describe('unwrapText()', ->
    tests =
      'inner text':
        initial:  '<span><span>Inner</span>Test</span>'
        expected: 'InnerTest'
      'multiple inner':
        initial:  '<span>Test<span>Test<span>Test</span></span></span>'
        expected: 'TestTestTest'
      'dont unwrap':
        initial:  '<span class="custom">Test</span>'
        expected: '<span class="custom">Test</span>'

    _.each(tests, (test, name) ->
      it(name, ->
        @container.innerHTML = test.initial
        Quill.Normalizer.unwrapText(@container)
        expect(@container).toEqualHTML(test.expected)
      )
    )
  )
)
