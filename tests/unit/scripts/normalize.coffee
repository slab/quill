#= require mocha
#= require chai
#= require jquery
#= require underscore
#= require tandem/editor


describe('Normalize', ->
  describe('block', ->
    editor = new Tandem.Editor('editor-container')
    tests = [{
      name: 'initialize empty document'
      before: ''
      expected: '<div><br></div>'
    }, {
      name: 'remove br from non-empty lines'
      before: 
        '<div>
          <br>
        </div>
        <div>
          <span>Text</span>
          <br />
        </div>'
      expected: 
        '<div>
          <br>
        </div>
        <div>
          <span>Text</span>
        </div>'
    }, {
      name: 'break block elements'
      before: 
        '<div>
          <div>
            <span>Hey</span>
          </div>
          <h1>
            <span>What</span>
          </h1>
        </div>'
      expected: 
        '<div>
          <span>Hey</span>
        </div>
        <div>
          <span>What</span>
        </div>'
    }, {
      name: 'remove redundant block elements'
      before:
        '<div>
          <div>
            <span>Hey</span>
          </div>
        </div>
        <div>
          <div>
            <div>
              <div>
                <span>What</span>
              </div>
            </div>
          </div>
        </div>'
      expected:
        '<div>
          <span>Hey</span>
        </div>
        <div>
          <span>What</span>
        </div>'
    }, {
      name: 'break list elements'
      before: 
        '<div>
          <ul>
            <li>One</li>
            <li>Two</li>
            <li>Three</li>
          </ul>
        </div>'
      expected:
        '<div>
          <span>One</span>
        </div>
        <div>
          <span>Two</span>
        </div>
        <div>
          <span>Three</span>
        </div>'
    }, {
      name: 'split block level tags within elements'
      before:
        '<div>
          <b>
            <i>What</i>
            <div>
              <s>Strike</s>
            </div>
            <u>Underline</u>
          </b>
        </div>'
      expected:
        '<div>
          <b>
            <i>What</i>
          </b>
        </div>
        <div>
          <b>
            <s>Strike</s>
          </b>
        </div>
        <div>
          <b>
            <u>Underline</u>
          </b>
        </div>'  
    }]

    _.each(tests, (test) ->
      it('shoud ' + test.name, ->
        editor.doc.root.innerHTML = Tandem.Utils.cleanHtml(test.before)
        editor.doc.buildLines()
        expect(Tandem.Utils.cleanHtml(editor.doc.root.innerHTML)).to.equal(Tandem.Utils.cleanHtml(test.expected))
      )
    )
  )
  
  
  describe('elements', ->
    editor = new Tandem.Editor('editor-container')
    tests = [{
      name: 'tranform equivalent styles'
      before:
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
      expected:
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
    }, {
      name: 'merge adjacent equal nodes'
      before:
        '<div>
          <b>Bold1</b>
          <b>Bold2</b>
        </div>'
      expected:
        '<div>
          <b>Bold1Bold2</b>
        </div>'
    }, {
      name: 'remove redundant attribute elements'
      before: 
        '<div>
          <b>
            <i>
              <b>Bolder</b>
            </i>
          </b>
        </div>'
      expected:
        '<div>
          <b>
            <i>Bolder</i>
          </b>
        </div>'
    }, {
      name: 'remove redundant elements'
      before: 
        '<div>
          <span>
            <br>
          <span>
        </div>
        <div>
          <span>
            <span>Span</span>
          <span>
        </div>'
      expected: 
        '<div>
          <br>
        </div>
        <div>
          <span>Span</span>
        </div>'
    }, {
      name: 'wrap text nodes'
      before: 
        '<div>Hey</div>'
      expected:
        '<div>
          <span>Hey</span>
        </div>'  
    }]


    _.each(tests, (test) ->
      it('shoud ' + test.name, ->
        editor.doc.root.innerHTML = Tandem.Utils.cleanHtml(test.before)
        editor.doc.buildLines()
        expect(Tandem.Utils.cleanHtml(editor.doc.root.innerHTML)).to.equal(Tandem.Utils.cleanHtml(test.expected))
      )
    )
  )
)
