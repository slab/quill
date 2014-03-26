describe('Normalizer', ->
  describe('statics', ->
    describe('breakLine', ->
      initials =
        'Inner divs': 
          '<div>
            <div><span>One</span></div>
            <div><span>Two</span></div>
          </div>'
        'Nested inner divs':
          '<div>
            <div><div><span>One</span></div></div>
            <div><div><span>Two</span></div></div>
          </div>'
      expectedHtml = [
        '<div><span>One</span></div>'
        '<div><span>Two</span></div>'
      ].join('')

      _.each(initials, (html, name) ->
        it(name, ->
          html = html.replace(/\s/g, '')
          container = $('#test-container').html(html).get(0)
          Scribe.Normalizer.breakLine(container.firstChild, container)
          expect(container.innerHTML).to.equal(expectedHtml)
        )
      )
    )

    describe('normalizeBreak', ->
      tests =
        'Break in middle of line':
          initial: [
            '<div><b>One<br>Two</b></div>'
          ]
          expected: [
            '<div><b>One</b></div>'
            '<div><b>Two</b></div>'
          ]
        'Break preceding line':
          initial: [
            '<div><b><br>One</b></div>'
          ]
          expected: [
            '<div><b><br></b></div>'
            '<div><b>One</b></div>'
          ]
        'Break after line':
          initial: [
            '<div><b>One<br></b></div>'
          ]
          expected: [
            '<div><b>One</b></div>'
          ]

      _.each(tests, (test, name) ->
        it(name, ->
          container = $('#test-container').html(test.initial.join('')).get(0)
          Scribe.Normalizer.normalizeBreak(container, container.querySelector('br'))
          expect(container.innerHTML).to.equal(test.expected.join(''))
        )
      )
    )

    describe('groupBlocks', ->
      tests =
        'Wrap newline':
          initial:  ['<br>']
          expected: ['<div><br></div>']
        'Wrap span':
          initial:  ['<span>One</span>']
          expected: ['<div><span>One</span></div>']
        'Wrap many spans':
          initial: [
            '<div><span>One</span></div>'
            '<span>Two</span>'
            '<span>Three</span>'
            '<div><span>Four</span></div>'
          ]
          expected: [
            '<div><span>One</span></div>'
            '<div><span>Two</span><span>Three</span></div>'
            '<div><span>Four</span></div>'
          ]
        'Wrap break and span':
          initial:  ['<br><span>One</span>']
          expected: ['<div><br><span>One</span></div>']

      _.each(tests, (test, name) ->
        it(name, ->
          container = $('#test-container').html(test.initial.join('')).get(0)
          Scribe.Normalizer.groupBlocks(container)
          expect(container.innerHTML).to.equal(test.expected.join(''))
        )
      )
    )
  )

  describe('methods', ->
    beforeEach( ->
      @container = $('#test-container').get(0)
      formatManager = new Scribe.FormatManager(@container,
        formats: Scribe.DEFAULTS.formats
      )
      @normalizer = new Scribe.Normalizer(@container, formatManager)
    )

    describe('normalizeLine', ->
      tests =
        'preserve font size':
          initial  : '<span style="font-size: 32px;">Huge</span>'
          expected : '<span style="font-size: 32px;">Huge</span>'
        'preserve font family':
          initial  : '<span style="font-family: \'Times New Roman\', serif;">Serif</span>'
          expected : '<span style="font-family: \'Times New Roman\', serif;">Serif</span>'
        'preserve font color':
          initial  : '<span style="color: rgb(255, 0, 0);">Red</span>'
          expected : '<span style="color: rgb(255, 0, 0);">Red</span>'
        'preserve font background-color':
          initial  : '<span style="background-color: rgb(255, 0, 0);">Red</span>'
          expected : '<span style="background-color: rgb(255, 0, 0);">Red</span>'
        'remove redundant format elements':
          initial  : '<b><i><b>Bolder</b></i></b>'
          expected : '<b><i>Bolder</i></b>'
        'remove redundant elements 1':
          initial  : '<span><br></span>'
          expected : '<br>'
        'remove redundant elements 2':
          initial  : '<span><span>Span</span></span>'
          expected : '<span>Span</span>'
        'remove redundant elements 3':
          initial  : '<span class="nothing special"><span>Span</span></span>'
          expected : '<span>Span</span>'
        'wrap text node':
          initial  : 'Hey'
          expected : '<span>Hey</span>'
        'wrap text node next to element node':
          initial  : 'Hey<b>Bold</b>'
          expected : '<span>Hey</span><b>Bold</b>'
        'unnecessary break':
          initial  : '<span>One</span><br>'
          expected : '<span>One</span>'

      _.each(tests, (test, name) ->
        it(name, ->
          lineNode = $('#test-container').html(test.initial).get(0)
          @normalizer.normalizeLine(lineNode)
          expect(lineNode.innerHTML).to.equal(test.expected)
        )
      )
    )

    describe('normalizeDoc', ->
      tests =
        'empty string':
          initial:  ''
          expected: '<div><span></span></div>'
        'empty span':
          initial:  '<div><span></span></div>'
        'lone break':
          initial:  '<br>'
          expected: '<div><br></div>'
        'correct break':
          initial:  '<div><br></div>'
        'correct trailing newline':
          initial:  [
            '<div><span>Test</span></div>'
            '<div><br></div>'
          ]
        'correct multiline':
          initial:  [
            '<div><span>One</span></div>'
            '<div><span>Two</span></div>'
          ]
        'handle nonstandard block tags':
          initial: [
            '<h1>
              <dl><dt>One</dt></dl>
              <pre>Two</pre>
              <p><span>Three</span></p>
            </h1>'
          ]
          expected: [
            '<div><span>One</span></div>'
            '<div><span>Two</span></div>'
            '<div><span>Three</span></div>'
          ]
        'correct break':
          initial:  '<div><br></div>'
        'correct trailing newline':
          initial:  [
            '<div><span>Test</span></div>'
            '<div><br></div>'
          ]
        'correct multiline':
          initial:  [
            '<div><span>One</span></div>'
            '<div><span>Two</span></div>'
          ]
        'handle nonstandard block tags':
          initial: [
            '<h1>
              <dl><dt>One</dt></dl>
              <pre>Two</pre>
              <p><span>Three</span></p>
            </h1>'
          ]
          expected: [
            '<div><span>One</span></div>'
            '<div><span>Two</span></div>'
            '<div><span>Three</span></div>'
          ]
        'handle nonstandard break tags':
          initial: [
            '<div><b>One<br><hr>Two</b></div>'
          ]
          expected: [
            '<div><b>One</b></div>'
            '<div><br></div>'
            '<div><b>Two</b></div>'
          ]
        'tranform equivalent styles':
          initial: [
            '<div>
              <strong>Strong</strong>
              <del>Deleted</del>
              <em>Emphasis</em>
              <strike>Strike</strike>
              <b>Bold</b>
              <i>Italic</i>
              <s>Strike</s>
              <u>Underline</u>
            </div>'
          ]
          expected: [
            '<div>
              <b>Strong</b>
              <s>Deleted</s>
              <i>Emphasis</i>
              <s>Strike</s>
              <b>Bold</b>
              <i>Italic</i>
              <s>Strike</s>
              <u>Underline</u>
            </div>'
          ]

      _.each(tests, (test, name) ->
        it(name, ->
          html = if _.isArray(test.initial) then test.initial.join('') else test.initial
          @container.innerHTML = html.replace(/\s/g, '')
          @normalizer.normalizeDoc()
          expected = (test.expected or html)
          expected = expected.join('') if _.isArray(expected)
          expect(@container.innerHTML).to.equal(expected.replace(/\s/g, ''))
        )
      )
    )

    describe('normalizeTags', ->
      tests =
        'strip extraneous attributes':
          initial  : '<span data-test="test" width="100px">One</span>'
          expected : '<span>One</span>'
        'strip extraneous attributes from tag':
          initial  : '<b data-test="test" width="100px">Bold</b>'
          expected : '<b>Bold</b>'
        'strip extraneous attributes from style tag':
          initial  : '<span style="color: rgb(0, 255, 255);" data-test="test" width="100px">Color</span>'
          expected : '<span style="color: rgb(0, 255, 255);">Color</span>'
        'separate multiple styles':
          initial  : '<span style="background-color: rgb(255, 0, 0); color: rgb(0, 255, 255);">Color</span>'
          expected : '<span style="color: rgb(0, 255, 255);"><span style="background-color: rgb(255, 0, 0);">Color</span></span>'
        'separate conflicting styles':
          initial  : '<u style="text-decoration: line-through;">Understrike</u>'
          expected : '<u><s>Understrike</s></u>'
        'separate non-standard style':
          initial  : '<span style="font-style:italic;">Italic</span>'
          expected : '<i>Italic</i>'
        'separate style from non-span':
          initial  : '<i style="color: rgb(0, 255, 255);">Color</i>'
          expected : '<span style="color: rgb(0, 255, 255);"><i>Color</i></span>'
        'separate multiple styles from non-span':
          initial  : '<i style="background-color: rgb(255, 0, 0); color: rgb(0, 255, 255);">Color</i>'
          expected : '<span style="background-color: rgb(255, 0, 0);"><span style="color: rgb(0, 255, 255);"><i>Color</i></span></span>'

      _.each(tests, (test, name) ->
        it(name, ->
          @container.innerHTML = test.initial
          @normalizer.normalizeTags(@container)
          expect(@container.innerHTML).to.equal(test.expected)
        )
      )
    )  
  )
)
