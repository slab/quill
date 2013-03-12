describe('Normalize', ->
  tests = 
    'blocks':
      'Inner divs':
        lines: [
          '<div>
            <div><span>One</span></div>
            <div><span>Two</span></div>
          </div>'
        ]
        expected: [
          '<div>
            <span>One</span>
          </div>
          <div>
            <span>Two</span>
          </div>'
        ]
      'Nested inner divs':
        lines: [
          '<div>
            <div><div><span>One</span></div></div>
            <div><div><span>Two</span></div></div>
          </div>'
        ]
        expected: [
          '<div>
            <span>One</span>
          </div>
          <div>
            <span>Two</span>
          </div>'
        ]
      'Break in middle of line':
        lines: [
          '<div><b>One<br />Two</b></div>'
        ]
        expected: [
          '<div><b>One</b></div>
          <div><b>Two</b></div>'
        ]
      'Break preceding line':
        lines: [
          '<div><b><br /><span>One</b></div>'
        ]
        expected: [
          '<div>
            <br />
          </div>
          <div>
            <b>One</b>
          </div>'
        ]
      'Break after line ignored':
        lines: [
          '<div><b>One<br /></b></div>'
        ]
        expected: [
          '<div><b>One</b></div>'
        ]
      'Wrap newline':
        lines:    ['<br />']
        expected: ['<div><br /></div>']
      'Wrap span':
        lines:    ['<span>One</span>']
        expected: ['<div><span>One</span></div>']
      'Wrap many spans':
        lines: [
          '<div>
            <span>One</span>
          </div>
          <span>Two</span>
          <span>Three</span>
          <div>
            <span>Four</span>
          </div>'
        ]
        expected: [
          '<div>
            <span>One</span>
          </div>
          <div>
            <span>Two</span>
            <span>Three</span>
          </div>
          <div>
            <span>Four</span>
          </div>'
        ]
      'Wrap break and span':
        lines: [
          '<br />
          <span>One</span>'
        ]
        expected: [
          '<div><br /></div>
          <div><span>One</span></div>'
        ]
      'Break within span':
        lines: [
          '<div><span><br />One</span></div>'
        ]
        expected: [
          '<div><br /></div>
          <div><span>One</span></div>'
        ]
      'Custom':
        lines: [
          '<b><br /><span>One</span></b><i>Two</i>'
        ]
        expected: [
          '<div><br /></div>
          <div><b>One<b><i>Two</i></div>'
        ]

    'elements':
      'tranform equivalent styles':
        lines: [
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
      'merge adjacent equal nodes':
        lines:    ['<div><b>Bold1</b><b>Bold2</b></div>']
        expected: ['<div><b>Bold1Bold2</b></div>']
      'merge adjacent equal spans':
        lines: [
          '<div>
            <span class="color-red">
              <span class="background-blue">Red1</span>
            </span>
            <span class="color-red">
              <span class="background-blue">Red2</span>
            </span>
          </div>'
        ]
        expected: [
          '<div>
            <span class="color-red">
              <span class="background-blue">Red1Red2</span>
            </span>
          </div>'
        ]
      'do not merge adjacent unequal spans':
        lines: [
          '<div>
            <span class="size-huge">Huge</span>
            <span class="size-large">Large</span>
          </div>'
        ]
        expected: [
          '<div>
            <span class="size-huge">Huge</span>
            <span class="size-large">Large</span>
          </div>'
        ]
      'remove redundant format elements':
        lines: ['<div><b><i><b>Bolder</b></i></b></div>']
        expected: ['<div><b><i>Bolder</i></b></div>']
      'remove redundant elements':
        lines: ['<div><span><br></span></div>', '<div><span><span>Span</span></span></div>']
        expected: ['<div><br></div>', '<div><span>Span</span></div>']
      'wrap text node':
        lines: ['<div>Hey</div>']
        expected: ['<div><span>Hey</span></div>']
      'wrap text node next to element node':
        lines: ['<div>Hey<b>Bold</b></div>']
        expected: ['<div><span>Hey</span><b>Bold</b></div>']

  _.each(tests, (testGroup, groupName) ->
    describe(groupName, ->
      _.each(testGroup, (test, name) ->
        it(name, ->
          $('#editor-container').html(Scribe.Utils.cleanHtml(test.lines.join('')))
          editor = new Scribe.Editor('editor-container')
          delta = editor.doc.toDelta()
          expectedHtml = _.map(test.expected, (line) ->
            return if _.isNumber(line) then test.lines[line] else line
          ).join('')
          $('#editor-container').html(Scribe.Utils.cleanHtml(expectedHtml))
          editor = new Scribe.Editor('editor-container')
          expectedDelta = editor.doc.toDelta()
          expect(delta).to.deep.equal(expectedDelta)
        )
      )
    )
  )
)

