#= require mocha
#= require chai
#= require jquery
#= require underscore
#= require tandem/editor


describe('Normalize', ->
  tests = 
    'block':
      'initialize empty document':
        lines: ['']
        expected: ['<div><br></div>']
      'remove br from non-empty lines':
        lines: ['<div><br></div>', '<div><span>Text</span><br></div>']
        expected: [0, '<div><span>Text</span></div>']
      'break block elements':
        lines: ['<div><div><span>Hey</span></div><h1><span>What</span></h1></div>']
        expected: ['<div><span>Hey</span></div>', '<div><span>What</span></div>']
      'break on br tags':
        lines: ['<div><span>Text</span><br><b>Bold</b><br><i>Italic</i></div>']
        expected: ['<div><span>Text</span></div>', '<div><b>Bold</b></div>', '<div><i>Italic</i></div>']
      'remove redundant block elements':
        lines: ['<div><div><span>Hey</span></div></div><div><div><div><div><span>What</span></div></div></div></div>']
        expected: ['<div><span>Hey</span></div>', '<div><span>What</span></div>']
      'break list elements':
        lines: ['<ul><li>One</li><li>Two</li><li>Three</li></ul>']
        expected: ['<ul><li><span>One</span></li></ul>', '<ul><li><span>Two</span></li></ul>' ,'<ul><li><span>Three</span></li></ul>']
      'split block level tags within elements':
        lines: ['<div><b><i>What</i><div><s>Strike</s></div><u>Underline</u></b></div>']
        expected: ['<div><b><i>What</i></b></div>', '<div><b><s>Strike</s></b></div>', '<div><b><u>Underline</u></b></div>']
      'should correctly break inner br tag':
        lines: ['<div><span><br></span></div>']
        expected: ['<div><br></div>']

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
        lines: ['<div><b>Bold1</b><b>Bold2</b></div>']
        expected: ['<div><b>Bold1Bold2</b></div>']
      'merge adjacent equal spans':
        lines: [
          '<div>
            <span class="font-color red">
              <span class="font-background blue">Red1</span>
            </span>
            <span class="font-color red">
              <span class="font-background blue">Red2</span>
            </span>
          </div>'
        ]
        expected: [
          '<div>
            <span class="font-color red">
              <span class="font-background blue">Red1Red2</span>
            </span>
          </div>'
        ]
      'do not merge adjacent unequal spans':
        lines: [
          '<div>
            <span class="font-size huge">Huge</span>
            <span class="font-size large">Large</span>
          </div>'
        ]
        expected: [
          '<div>
            <span class="font-size huge">Huge</span>
            <span class="font-size large">Large</span>
          </div>'
        ]
      'remove redundant attribute elements':
        lines: ['<div><b><i><b>Bolder</b></i></b></div>']
        expected: ['<div><b><i>Bolder</i></b></div>']
      'remove redundant elements':
        lines: ['<div><span><br><span></div>', '<div><span><span>Span</span><span></div>']
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
          $('#editor-container').html(Tandem.Utils.cleanHtml(test.lines.join('')))
          editor = new Tandem.Editor('editor-container')
          delta = editor.doc.toDelta()
          expectedHtml = _.map(test.expected, (line) ->
            return if _.isNumber(line) then test.lines[line] else line
          ).join('')
          $('#editor-container').html(Tandem.Utils.cleanHtml(expectedHtml))
          editor = new Tandem.Editor('editor-container')
          expectedDelta = editor.doc.toDelta()
          expect(delta).to.deep.equal(expectedDelta)
        )
      )
    )
  )
)

