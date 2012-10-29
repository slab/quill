#= require mocha
#= require chai
#= require range
#= require jquery
#= require underscore

describe('Editor', ->
  describe('applyDelta', ->
    tests =
      'append character':
        lines: ['<div><span>0123</span></div>']
        deltas: [new JetRetain(0,4), new JetInsert('4')]
        expected: ['<div><span>01234</span></div>']
      'prepend character':
        lines: ['<div><span>0123</span></div>']
        deltas: [new JetInsert('4'), new JetRetain(0,4)]
        expected: ['<div><span>40123</span></div>']
      'append formatted character':
        lines: ['<div><span>0123</span></div>']
        deltas: [new JetRetain(0,4), new JetInsert('4', {bold: true})]
        expected: ['<div><span>0123</span><b>4</b></div>']
      'insert newline in middle of text':
        lines: ['<div><span>0123</span></div>']
        deltas: [new JetRetain(0,2), new JetInsert("\n"), new JetRetain(2,4)]
        expected: ['<div><span>01</span></div>', '<div><span>23</span></div>']
      'insert newline before line with just newline':
        lines: ['<div><span>01</span></div>', '<div><br></div>', '<div><span>23</span></div>']
        deltas: [new JetRetain(0,3), new JetInsert("\n"), new JetRetain(3,6)]
        expected: [0, 1, 1, 2]
      'insert newline after line with just newline':
        lines: ['<div><span>01</span></div>', '<div><br></div>', '<div><span>23</span></div>']
        deltas: [new JetRetain(0,4), new JetInsert("\n"), new JetRetain(4,6)]
        expected: [0, 1, 1, 2]
      'insert newline before list':
        lines: ['<div><span>01</span></div>', '<ul><li><span>23</span></li></ul>']
        deltas: [new JetRetain(0,3), new JetInsert("\n"), new JetRetain(3,5)]
        expected: [0, '<div><br></div>', 1]
      'insert newline after list':
        lines: ['<ul><li><span>01</span></li></ul>', '<div><span>23</span></div>']
        deltas: [new JetRetain(0,2), new JetInsert("\n"), new JetRetain(2,5)]
        expected: [0, '<div><br></div>', 1]
      'insert newline before list with just newline':
        lines: ['<div><span>01</span></div>', '<ul><li><br></li></ul>', '<div><span>23</span></div>']
        deltas: [new JetRetain(0,3), new JetInsert("\n"), new JetRetain(3,6)]
        expected: [0, '<div><br></div>', 1, 2]
      'insert newline after list with just newline':
        lines: ['<div><span>01</span></div>', '<ul><li><br></li></ul>', '<div><span>23</span></div>']
        deltas: [new JetRetain(0,4), new JetInsert("\n"), new JetRetain(4,6)]
        expected: [0, 1, '<div><br></div>', 2]
      'retain entire text':
        lines: ['<div><span>01</span></div>', '<ul><li><br></li></ul>', '<div><span>23</span></div>']
        deltas: [new JetRetain(0,6)]
        expected: [0, 1, 2]
      'retain entire text with format':
        lines: ['<div><span>01</span></div>', '<ul><li><br></li></ul>', '<div><span>23</span></div>']
        deltas: [new JetRetain(0,6,{bold:true})]
        expected: ['<div><b>01</b></div>', '<ul><li><b></b></li></ul>', '<div><b>23</b></div>']
      'retain nothing':
        lines: ['<div><span>01</span></div>', '<ul><li><br></li></ul>', '<div><span>23</span></div>']
        deltas: []
        expected: ['<div><br></div>']
      'append differing formatted texts':
        lines: ['<div><br></div>']
        deltas: [new JetInsert('01', {bold:true}), new JetInsert('23', {italic:true})]
        expected: ['<div><b>01</b><i>23</i></div>']
      'append differing formatted texts with line attributes':
        lines: ['<div><br></div>']
        deltas: [new JetInsert('01', {bullet:1}), new JetInsert("\n"), new JetInsert('23', {bold:true})]
        expected: ['<ul class="indent-1"><li><span>01</span></li></ul>', '<div><b>23</b></div>']

    _.each(tests, (test, name) ->
      it(name, ->
        html = Tandem.Utils.cleanHtml(test.lines.join(''))
        $('#editor-container').html(html)
        editor = new Tandem.Editor('editor-container')
        oldDelta = editor.doc.toDelta()
        startLength = oldDelta.endLength
        endLength = _.reduce(test.deltas, ((count, delta) -> return count + delta.getLength()), 0)
        delta = new JetDelta(startLength, endLength, test.deltas)
        expectedHtml = _.map(test.expected, (line) ->
          return if _.isNumber(line) then test.lines[line] else line
        ).join('')
        editor.applyDelta(delta)
        newDelta = editor.doc.toDelta()
        editor.destroy()
        $('#editor-container').html(expectedHtml)
        editor = new Tandem.Editor('editor-container')
        expectedDelta = editor.doc.toDelta()
        editor.destroy()
        expect(newDelta).to.deep.equal(expectedDelta)
      )
    )
  )



  describe('Apply Leaf Attribute', ->
    tests = 
      'single node':
        lines: ['<div><s>0</s><u>1</u><s>2</s></div>']
        start: 1, length: 1
        expected: ['<div><s>0</s><#><u>1</u></#><s>2</s></div>']
      'multiple nodes':
        lines: ['<div><s>0</s><u>1</u><s>2</s><u>3</u></div>']
        start: 1, length: 2
        expected: ['<div><s>0</s><#><u>1</u><s>2</s></#><u>3</u></div>']
      'part of node':
        lines: ['<div><#>012</#><i>345</i></div>']
        start: 3, length: 2
        expected: ['<div><#>012</#><#><i>34</i></#><i>5</i></div>']
      'inside of node':
        lines: ['<div><#>012</#><i>345</i></div>']
        start: 4, length: 1
        expected: ['<div><#>012</#><i>3</i><#><i>4</i></#><i>5</i></div>']
      'nodes spanning multiple lines':
        lines: ['<div><#>012</#><i>345</i></div>', '<div><s>7</s><u>8</u></div>']
        start: 3, length: 5
        expected: ['<div><#>012</#><#><i>345</i></#></div>', '<div><#><s>7</s></#><u>8</u></div>']
      'entire line':
        lines: ['<div><#>01</#><i>23</i></div>', '<div><s>5</s><u>6</u></div>', '<div><b>89</b></div>']
        start: 5, length: 2
        expected: [0, '<div><#><s>5</s><u>6</u></#></div>', 2]
      'entire line with trailing newline':
        lines: ['<div><#>01</#><i>23</i></div>', '<div><s>5</s><u>6</u></div>', '<div><b>89</b></div>']
        start: 5, length: 3
        expected: [0, '<div><#><s>5</s><u>6</u></#></div>', 2]
      'entire line with preceding newline':
        lines: ['<div><#>01</#><i>23</i></div>', '<div><s>5</s><u>6</u></div>', '<div><b>89</b></div>']
        start: 4, length: 3
        expected: [0, '<div><#><s>5</s><u>6</u></#></div>', 2]
      'entire line with preceding and trailing newline':
        lines: ['<div><#>01</#><i>23</i></div>', '<div><s>5</s><u>6</u></div>', '<div><b>89</b></div>']
        start: 4, length: 4
        expected: [0, '<div><#><s>5</s><u>6</u></#></div>', 2]

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

    _.each(tests, (test, name) ->
      originalHtml = test.lines.join('')
      expectedHtml = _.map(test.expected, (line) ->
        return if _.isNumber(line) then test.lines[line] else line
      ).join('')
      _.each(attributeTests, (attrTest) ->
        it("should set #{attrTest.attribute} to #{attrTest.value} on #{name}", ->
          openTag = if attrTest.tagName == 'span' then "#{attrTest.tagName} class=\"#{attrTest.attribute} #{attrTest.value}\"" else attrTest.tagName
          expected = expectedHtml.replace(/\/#/g, "/#{attrTest.tagName}").replace(/#/g, openTag)
          original = originalHtml.replace(/\/#/g, "/#{attrTest.tagName}").replace(/#/g, openTag)
          apply = attrTest.value && Tandem.Utils.getAttributeDefault(attrTest.attribute) != attrTest.value
          [startHtml, endHtml] = if apply then [original, expected] else [expected, original]
          $('#editor-container').html(startHtml)
          editor = new Tandem.Editor('editor-container')
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
          editor.destroy()
          $('#editor-container').html(endHtml)
          editor = new Tandem.Editor('editor-container')
          expectedDelta = editor.doc.toDelta()
          consistent = Tandem.Debug.checkDocumentConsistency(editor.doc, true)
          editor.destroy()
          expect(delta).to.deep.equal(expectedDelta)
          expect(consistent).to.be.true
        )
      )
    )
  )



  describe('Apply Line Attribute', ->
    tests = 
      'entire line':
        lines: ['<div><b>01</b><i>23</i></div>', '<div><s>5</s><u>6</u></div>', '<div><b>89</b></div>']
        start: 5, length: 2
        expected: [0, '<ul class="indent-2"><li><s>5</s><u>6</u></li></ul>', 2]
      'multiple lines':
        lines: ['<div><b>01</b><i>23</i></div>', '<div><s>5</s><u>6</u></div>', '<div><b>89</b></div>']
        start: 0, length: 7
        expected: ['<ul class="indent-2"><li><b>01</b><i>23</i></li></ul>', '<ul class="indent-2"><li><s>5</s><u>6</u></li></ul>', 2]
      'entire line with trailing newline':
        lines: ['<div><b>01</b><i>23</i></div>', '<div><s>5</s><u>6</u></div>', '<div><b>89</b></div>']
        start: 5, length: 3
        expected: [0, '<ul class="indent-2"><li><s>5</s><u>6</u></li></ul>', 2]
      'entire line with preceding newline':
        lines: ['<div><b>01</b><i>23</i></div>', '<div><s>5</s><u>6</u></div>', '<div><b>89</b></div>']
        start: 4, length: 3
        expected: [0, '<ul class="indent-2"><li><s>5</s><u>6</u></li></ul>', 2]
      'entire line with preceding and trailing newline':
        lines: ['<div><b>01</b><i>23</i></div>', '<div><s>5</s><u>6</u></div>', '<div><b>89</b></div>']
        start: 4, length: 4
        expected: [0, '<ul class="indent-2"><li><s>5</s><u>6</u></li></ul>', 2]

    _.each(tests, (test, name) ->
      originalHtml = test.lines.join('')
      expectedHtml = _.map(test.expected, (line) ->
        return if _.isNumber(line) then test.lines[line] else line
      ).join('')
      _.each([2, false], (val) ->
        it("should set list to #{val} on #{name}", ->
          apply = val != false
          [startHtml, endHtml] = if apply then [originalHtml, expectedHtml] else [expectedHtml, originalHtml]
          $('#editor-container').html(startHtml)
          editor = new Tandem.Editor('editor-container')
          editor.applyAttribute(test.start, test.length, 'bullet', val)
          range = new Tandem.Range(editor, test.start, test.start + test.length)
          attributes = range.getAttributes()
          if apply
            expect(attributes['bullet']).to.equal(val)
          else
            expect(attributes['bullet']).to.be.undefined
          delta = editor.doc.toDelta()
          editor.destroy()
          $('#editor-container').html(endHtml)
          editor = new Tandem.Editor('editor-container')
          expectedDelta = editor.doc.toDelta()
          consistent = Tandem.Debug.checkDocumentConsistency(editor.doc, true)
          editor.destroy()
          expect(delta).to.deep.equal(expectedDelta)
          expect(consistent).to.be.true
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
        expect(Tandem.Debug.checkDocumentConsistency(editor.doc, true)).to.be.true
        delta = editor.doc.toDelta()
        editor.doc.root.innerHTML = Tandem.Utils.cleanHtml(test.expected)
        editor.doc.buildLines()
        expect(delta).to.deep.equal(editor.doc.toDelta())
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
          expect(Tandem.Debug.checkDocumentConsistency(editor.doc, true)).to.be.true
          delta = editor.doc.toDelta()
          if _.isString(test.expected)
            expected = test.expected
          else if _.isArray(test.expected)
            expected = test[index]
          else
            expected = test.expected(index)
          editor.doc.root.innerHTML = Tandem.Utils.cleanHtml(expected)
          editor.doc.buildLines()
          expect(delta).to.deep.equal(editor.doc.toDelta())
          editor.destroy()
        )
      )
    )
  )
)


