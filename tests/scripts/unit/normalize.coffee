#= require mocha
#= require chai
#= require jquery
#= require underscore
#= require tandem/editor


describe('Normalize', ->
  tests = 
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
          editor.destroy()
          $('#editor-container').html(Tandem.Utils.cleanHtml(expectedHtml))
          editor = new Tandem.Editor('editor-container')
          expectedDelta = editor.doc.toDelta()
          expect(delta).to.deep.equal(expectedDelta)
          editor.destroy()
        )
      )
    )
  )
)

