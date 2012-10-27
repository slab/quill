#= require mocha
#= require chai
#= require range
#= require jquery
#= require underscore

describe('Editor', ->
  describe('applyAttribute', ->
    originalHtml = Tandem.Utils.cleanHtml('
      <div>
        <#>123</#>
        <i>456</i>
      </div>
      <div>
        <s>7</s>
        <u>8</u>
        <s>9</s>
        <u>0</u>
      </div>
      <div>
        <b>abcdefg</b>
      </div>
    ')

    reset = (html = originalHtml) ->
      $('#editor-container').html(Tandem.Utils.cleanHtml(html, true))
      editor = new Tandem.Editor('editor-container')
      editor.ignoreDomChanges = true
      return editor

    tests = [{
      target: 'single node'
      start: 8
      length: 1
      expected:
        '<div>
          <#>123</#>
          <i>456</i>
        </div>
        <div>
          <s>7</s>
          <#>
            <u>8</u>
          </#>
          <s>9</s>
          <u>0</u>
        </div>
        <div>
          <b>abcdefg</b>
        </div>'
    }, {
      target: 'multiple nodes'
      start: 8
      length: 2
      expected:
        '<div>
          <#>123</#>
          <i>456</i>
        </div>
        <div>
          <s>7</s>
          <#>
            <u>8</u>
            <s>9</s>
          </#>
          <u>0</u>
        </div>
        <div>
          <b>abcdefg</b>
        </div>'
    }, {
      target: 'part of node'
      start: 3
      length: 2
      expected:
        '<div>
          <#>123</#>
          <#>
            <i>45</i>
          </#>
          <i>6</i>
        </div>
        <div>
          <s>7</s>
          <u>8</u>
          <s>9</s>
          <u>0</u>
        </div>
        <div>
          <b>abcdefg</b>
        </div>'
    }, {
      target: 'inside of node'
      start: 4
      length: 1
      expected:
        '<div>
          <#>123</#>
          <i>4</i>
          <#>
            <i>5</i>
          </#>
          <i>6</i>
        </div>
        <div>
          <s>7</s>
          <u>8</u>
          <s>9</s>
          <u>0</u>
        </div>
        <div>
          <b>abcdefg</b>
        </div>'
    }, {
      target: 'nodes spanning multiple lines'
      start: 3
      length: 6
      expected:
        '<div>
          <#>123</#>
          <#>
            <i>456</i>
          </#>
        </div>
        <div>
          <#>
            <s>7</s>
            <u>8</u>
          </#>
          <s>9</s>
          <u>0</u>
        </div>
        <div>
          <b>abcdefg</b>
        </div>'
    }, {
      target: 'entire line'
      start: 7
      length: 4
      expected:
        '<div>
          <#>123</#>
          <i>456</i>
        </div>
        <div>
          <#>
            <s>7</s>
            <u>8</u>
            <s>9</s>
            <u>0</u>
          </#>
        </div>
        <div>
          <b>abcdefg</b>
        </div>'
    }, {
      target: 'entire line with trailing newline'
      start: 7
      length: 5
      expected:
        '<div>
          <#>123</#>
          <i>456</i>
        </div>
        <div>
          <#>
            <s>7</s>
            <u>8</u>
            <s>9</s>
            <u>0</u>
          </#>
        </div>
        <div>
          <b>abcdefg</b>
        </div>'
    }, {
      target: 'entire line with preceding newline'
      start: 6
      length: 5
      expected:
        '<div>
          <#>123</#>
          <i>456</i>
        </div>
        <div>
          <#>
            <s>7</s>
            <u>8</u>
            <s>9</s>
            <u>0</u>
          </#>
        </div>
        <div>
          <b>abcdefg</b>
        </div>'
    }, {
      target: 'entire line with preceding and trailing newline'
      start: 6
      length: 6
      expected:
        '<div>
          <#>123</#>
          <i>456</i>
        </div>
        <div>
          <#>
            <s>7</s>
            <u>8</u>
            <s>9</s>
            <u>0</u>
          </#>
        </div>
        <div>
          <b>abcdefg</b>
        </div>'
    }]

    attributeTests = [{
      attribute: 'bold'
      tagName: 'b'
      value: true
    }, {
      attribute: 'bold'
      tagName: 'b'
      value: false
    }, {
      attribute: 'font-family'
      tagName: 'span'
      value: 'serif'
    }, {
      attribute: 'font-family'
      tagName: 'span'
      value: false
    }, {
      attribute: 'font-family'
      tagName: 'span'
      value: 'san-serif'
    }]

    _.each(tests, (test) ->
      _.each(attributeTests, (attrTest) ->
        it("should set #{attrTest.attribute} to #{attrTest.value} on #{test.target}", ->
          openTag = if attrTest.tagName == 'span' then "#{attrTest.tagName} class=\"#{attrTest.attribute} #{attrTest.value}\"" else attrTest.tagName
          expected = test.expected.replace(/\/#/g, "/#{attrTest.tagName}").replace(/#/g, openTag)
          original = originalHtml.replace(/\/#/g, "/#{attrTest.tagName}").replace(/#/g, openTag)
          apply = attrTest.value && Tandem.Utils.getAttributeDefault(attrTest.attribute) != attrTest.value
          [startHtml, endHtml] = if apply then [original, expected] else [expected, original]
          editor = reset(startHtml)
          editor.applyAttribute(test.start, test.length, attrTest.attribute, attrTest.value)
          range = new Tandem.Range(editor, test.start, test.start + test.length)
          attributes = range.getAttributes()
          if apply
            expect(attributes[attrTest.attribute]).to.equal(attrTest.value)
          else
            if attrTest.attribute == 'bold'
              expect(attributes[attrTest.attribute]).to.be.undefined
            else if attrTest.attribute == 'font-family'
              expect(attributes[attrTest.attribute]).to.equal('san-serif')
          delta = editor.doc.toDelta()
          editor.doc.root.innerHTML = Tandem.Utils.cleanHtml(endHtml, true)
          editor.doc.buildLines()
          consistency = editor.doc.checkConsistency(true)
          expect(editor.doc.toDelta()).to.deep.equal(newDelta)
          expect(consistency).to.be.true
          editor.destroy()
        )
      )
    )
  )



  describe('insertAt', ->
    reset = ->
      $('#editor-container').html(Tandem.Utils.cleanHtml(
        '<div>
          <span>123</span>
          <i>456</i>
        </div>'
      ))
      return new Tandem.Editor('editor-container')

    tests = [{
      name: 'should insert simple text'
      index: 1
      text: 'A'
      expected: 
        '<div>
          <span>1A23</span>
          <i>456</i>
        </div>'
    }, {
      name: 'should insert text inside formatted tags'
      index: 4
      text: 'A'
      expected: 
        '<div>
          <span>123</span>
          <i>4</i>
          <span>A</span>
          <i>56</i>
        </div>'
    }, {
      name: 'should insert newline character'
      index: 1
      text: "\n"
      expected: 
        '<div>
          <span>1</span>
        </div>
        <div>
          <span>23</span>
          <i>456</i>
        </div>'
    }, {
      name: 'should insert text with newline'
      index: 1
      text: "A\nB"
      expected: 
        '<div>
          <span>1A</span>
        </div>
        <div>
          <span>B23</span>
          <i>456</i>
        </div>'
    }, {
      name: 'should insert multiple newline text'
      index: 1
      text: "A\nB\nC"
      expected: 
        '<div>
          <span>1A</span>
        </div>
        <div>
          <span>B</span>
        </div>
        <div>
          <span>C23</span>
          <i>456</i>
        </div>'
    }, {
      name: 'should add newline at boundary'
      index: 0
      text: "\n"
      expected: 
        '<div>
          <br>
        </div>
        <div>
          <span>123</span>
          <i>456</i>
        </div>'
    }, {
      name: 'should insert mutliple newline in a row text'
      index: 1
      text: "A\n\nC"
      expected: 
        '<div>
          <span>1A</span>
        </div>
        <div>
          <br>
        </div>
        <div>
          <span>C23</span>
          <i>456</i>
        </div>'
    }]

    _.each(tests, (test) ->
      it(test.name, ->
        editor = reset()
        editor.insertAt(test.index, test.text)
        expect(editor.doc.checkConsistency(true)).to.be.true
        delta = editor.doc.toDelta()
        editor.doc.root.innerHTML = Tandem.Utils.cleanHtml(test.expected)
        editor.doc.buildLines()
        expect(editor.doc.toDelta()).to.deep.equal(delta)
        editor.destroy()
      )
    )
  )



  describe('deleteAt', ->
    reset = ->
      $('#editor-container').html(Tandem.Utils.cleanHtml('
        <div>
          <b>123</b>
          <i>456</i>
        </div>
        <div>
          <s>7</s>
          <u>8</u>
          <s>9</s>
          <u>0</u>
        </div>
        <div>
          <b>abcdefg</b>
        </div>
      '))
      return new Tandem.Editor('editor-container')

    tests = [{
      name: 'a node'
      start: 0
      length: 3
      expected:
        '<div>
          <i>456</i>
        </div>
        <div>
          <s>7</s>
          <u>8</u>
          <s>9</s>
          <u>0</u>
        </div>
        <div>
          <b>abcdefg</b>
        </div>'
    }, {
      name: 'part of a node'
      start: [0..2]
      length: 1
      expected: (index) ->
        char = (index + 1).toString()
        html = "
          <div>
            <b>123</b>
            <i>456</i>
          </div>
          <div>
            <s>7</s>
            <u>8</u>
            <s>9</s>
            <u>0</u>
          </div>
          <div>
            <b>abcdefg</b>
          </div>"
        return html.replace(char.toString(), '')
    }, {
      name: 'multiple nodes'
      start: 0
      length: 6
      expected:
        '<div>
          <br>
        </div>
        <div>
          <s>7</s>
          <u>8</u>
          <s>9</s>
          <u>0</u>
        </div>
        <div>
          <b>abcdefg</b>
        </div>'
    }, {
      name: 'across multiple nodes'
      start: [0..2]
      length: 4
      expected: (index) ->
        fragments = [
          "<div><i>56</i></div>"
          "<div><b>1</b><i>6</i></div>"
          "<div><b>12</b></div>"
        ]
        return fragments[index] + "
          <div>
            <s>7</s>
            <u>8</u>
            <s>9</s>
            <u>0</u>
          </div>
          <div>
            <b>abcdefg</b>
          </div>"
    }, {
      name: 'the first line'
      start: 0
      length: 7
      expected:
        '<div>
          <s>7</s>
          <u>8</u>
          <s>9</s>
          <u>0</u>
        </div>
        <div>
          <b>abcdefg</b>
        </div>'
    }, {
      name: 'the last line'
      start: 11
      length: 8
      expected:
        '<div>
          <b>123</b>
          <i>456</i>
        </div>
        <div>
          <s>7</s>
          <u>8</u>
          <s>9</s>
          <u>0</u>
        </div>'
    }, {
      name: 'a middle line + newline'
      start: 7
      length: 5
      expected:
        '<div>
          <b>123</b>
          <i>456</i>
        </div>
        <div>
          <b>abcdefg</b>
        </div>'
    }, {
      name: 'newline + next line'
      start: 6
      length: 5
      expected:
        '<div>
          <b>123</b>
          <i>456</i>
        </div>
        <div>
          <b>abcdefg</b>
        </div>'
    }, {
      name: 'a newline character'
      start: 6
      length: 1
      expected:
        '<div>
          <b>123</b>
          <i>456</i>
          <s>7</s>
          <u>8</u>
          <s>9</s>
          <u>0</u>
        </div>
        <div>
          <b>abcdefg</b>
        </div>'
    }, {
      name: 'entire line and more'
      start: 5
      length: 8
      expected:
        '<div>
          <b>123</b>
          <i>45</i>
          <b>bcdefg</b>
        </div>'
    }, {
      name: 'across multiple lines'
      start: [2..4]
      length: 6
      expected: (index) ->
        fragments = [
          '<div><b>12</b><u>8</u><s>9</s><u>0</u></div>'
          '<div><b>123</b><s>9</s><u>0</u></div>'
          '<div><b>123</b><i>4</i><u>0</u></div>'
        ]
        return fragments[index] + '
          <div>
            <b>abcdefg</b>
          </div>'
    }]
    

    _.each(tests, (test) ->
      starts = if _.isNumber(test.start) then [test.start] else test.start
      _.each(starts, (start, index) ->
        name = 'should delete ' + test.name
        name += ' ' + index if starts.length > 1
        it(name, ->
          editor = reset()
          editor.deleteAt(start, test.length)
          expect(editor.doc.checkConsistency(true)).to.be.true
          delta = editor.doc.toDelta()
          if _.isString(test.expected)
            expected = test.expected
          else if _.isArray(test.expected)
            expected = test[index]
          else
            expected = test.expected(index)
          editor.doc.root.innerHTML = Tandem.Utils.cleanHtml(expected)
          editor.doc.buildLines()
          expect(editor.doc.toDelta()).to.deep.equal(delta)
          editor.destroy()
        )
      )
    )
  )
)


