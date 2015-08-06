dom = Quill.Lib.DOM

describe('Line', ->
  beforeEach( ->
    @container = jasmine.clearContainer()
    @doc = new Quill.Document(@container, { formats: Quill.DEFAULTS.formats })
  )

  describe('constructor', ->
    tests =
      'no children':
        initial: '<div style="text-align: right;"></div>'
        expected: '<div style="text-align: right;"><br></div>'
        format: { align: 'right' }
        leaves: [{ text: '', formats: {} }]
      'empty child':
        initial: '<div><b></b></div>'
        expected: '<div><b></b><br></div>'
        leaves: [{ text: '', formats: { bold: true } }, { text: '', formats: {} }]
      'leaf child':
        initial: '<div><b>Bold</b></div>'
        expected: '<div><b>Bold</b></div>'
        leaves: [{ text: 'Bold', formats: { bold: true } }]
      'nested leaf child':
        initial: '<div><s><b>Bold</b></s></div>'
        expected: '<div><s><b>Bold</b></s></div>'
        leaves: [{ text: 'Bold', formats: { bold: true, strike: true } }]
      'media child':
        initial: '<div><img src="http://quilljs.com/images/cloud.png"></div>'
        expected: '<div><img src="http://quilljs.com/images/cloud.png"></div>'
        leaves: [{ text: dom.EMBED_TEXT, formats: { image: 'http://quilljs.com/images/cloud.png' } }]
      'break child':
        initial: '<div><br></div>'
        expected: '<div><br></div>'
        leaves: [{ text: '', formats: {} }]
      'lots of children':
        initial: '<div><b><i>A</i><s>B</s></b><img src="http://quilljs.com/images/cloud.png"><u>D</u></div>'
        expected: '<div><b><i>A</i><s>B</s></b><img src="http://quilljs.com/images/cloud.png"><u>D</u></div>'
        leaves: [
          { text: 'A', formats: { bold: true, italic: true } }
          { text: 'B', formats: { bold: true, strike: true } }
          { text: dom.EMBED_TEXT, formats: { image: 'http://quilljs.com/images/cloud.png' } }
          { text: 'D', formats: { underline: true } }
        ]

    _.each(tests, (test, name) ->
      it(name, ->
        @container.innerHTML = test.initial
        lineNode = @container.firstChild
        line = new Quill.Line(@doc, lineNode)
        expect(line.node).toEqual(lineNode)
        expect(lineNode.outerHTML).toEqualHTML(test.expected, true)
        expect(line.leaves.length).toEqual(test.leaves.length)
        length = _.reduce(test.leaves, (length, leaf) ->
          return length + leaf.text.length
        , 1)
        expect(line.length).toEqual(length)
        leaves = line.leaves.toArray()
        _.each(leaves, (leaf, i) ->
          expect(leaf.text).toEqual(test.leaves[i].text)
          expect(leaf.formats).toEqual(test.leaves[i].formats)
        )
      )
    )
  )

  describe('findLeaf()', ->
    tests =
      'empty element':
        html: '<b>Bold</b><i><s></s><u>Under</u></i>'
        match: true, query: 's'
      'leaf parent':
        html: '<b>Bold</b><i><s>Strike</s><u>Under</u></i>'
        match: false, query: 'b'
      'break leaf':
        html: '<br>'
        match: true, query: 'br'
      'no match':
        html: '<b>Bold</b><i><s>Strike</s><u>Under</u></i>'
        match: false, query: $('#toolbar-container').get(0)
      'line with no leaves':
        html: ''
        match: false, query: $('#toolbar-container').get(0)

    _.each(tests, (test, name) ->
      it(name, ->
        @container.innerHTML = "<div>#{test.html}</div>"
        lineNode = @container.firstChild
        line = new Quill.Line(@doc, lineNode)
        queryNode = if _.isString(test.query) then @container.querySelector(test.query) else test.query
        leaf = line.findLeaf(queryNode)
        if test.match
          expect(leaf.node).toEqual(queryNode)
        else
          expect(leaf).toBe(undefined)
      )
    )

    it('text node', ->
      @container.innerHTML = "<div><s>Test</s>One</div>"
      lineNode = @container.firstChild
      line = new Quill.Line(@doc, lineNode)
      queryNode = @container.firstChild.firstChild.firstChild
      leaf = line.findLeaf(queryNode)
      expect(leaf.node).toEqual(queryNode)
    )
  )

  describe('findLeafAt()', ->
    tests =
      'empty line':
        html: '<br>'
        offset: 0
        expected: ['br', 0]
      'beyond empty line':
        html: '<br>'
        offset: 2
        expected: ['br', 0]
      'leaf at 0':
        html: '<b>0123</b><i>4567</i>'
        offset: 0
        expected: ['b', 0]
      'leaf in middle of line':
        html: '<b>0123</b><s>4567</s><u>8901</u>'
        offset: 6
        expected: ['s', 2]
      'leaf at boundry':
        html: '<b>0123</b><s>4567</s><u>8901</u>'
        offset: 4
        expected: ['s', 0]
      'leaf at boundry inclusive':
        html: '<b>0123</b><s>4567</s><u>8901</u>'
        offset: 4, inclusive: true
        expected: ['b', 4]
      'leaf with parent':
        html: '<b>0123</b><i><s>4567</s><u>8901</u></i>'
        offset: 6
        expected: ['s', 2]
      'leaf at boundary with parent':
        html: '<b>0123</b><i><s>4567</s><u>8901</u></i>'
        offset: 8
        expected: ['u', 0]
      'leaf at end of line':
        html: '<b>0123</b><i>4567</i>'
        offset: 9
        expected: ['i', 4]
      'beyond line':
        html: '<b>0123</b><i>4567</i>'
        offset: 10
        expected: ['i', 4]

    _.each(tests, (test, name) ->
      it(name, ->
        @container.innerHTML = "<div>#{test.html}</div>"
        lineNode = @container.firstChild
        line = new Quill.Line(@doc, lineNode)
        [leaf, offset] = line.findLeafAt(test.offset, test.inclusive)
        node = lineNode.querySelector(test.expected[0])
        node = node.firstChild unless node.tagName == dom.DEFAULT_BREAK_TAG
        expect(leaf.node).toEqual(node)
        expect(offset).toEqual(test.expected[1])
      )
    )
  )

  describe('format()', ->
    tests =
      'add text align':
        initial: '<div><br></div>'
        expected: '<div style="text-align: right;"><br></div>'
        formats: { align: 'right' }
      'add different text align':
        initial: '<div style="text-align: right;"><br></div>'
        expected: '<div style="text-align: center;"><br></div>'
        formats: { align: 'center' }
      'remove text align':
        initial: '<div style="text-align: right;"><br></div>'
        expected: '<div><br></div>'
        formats: { align: false }
      'add bold':
        initial: '<div><br></div>'
        expected: '<div><br></div>'
        formats: { bold: true }

    _.each(tests, (test, name) ->
      it(name, ->
        @container.innerHTML = test.initial
        lineNode = @container.firstChild
        line = new Quill.Line(@doc, lineNode)
        expectedFormats = _.clone(test.formats)
        _.each(test.formats, (value, name) ->
          line.format(name, value)
          delete expectedFormats[name] unless value
        )
        expect(line.formats).toEqual(expectedFormats)
        expect(line.node.outerHTML).toEqualHTML(test.expected, true)
      )
    )
  )

  describe('deleteText()', ->
    beforeEach( ->
      @container.innerHTML = '<div><b>01</b><i><s>23</s><u>45</u></i><b>67</b></div>'
      lineNode = @container.firstChild
      @line = new Quill.Line(@doc, lineNode)
    )

    tests =
      'part of node':
        expected: '<b>01</b><i><s>3</s><u>45</u></i><b>67</b>'
        offset: 2, length: 1
      'entire node':
        expected: '<b>01</b><i><s></s><u>45</u></i><b>67</b>'
        offset: 2, length: 2
      'part of multiple nodes':
        expected: '<b>01</b><i><s>2</s><u>5</u></i><b>67</b>'
        offset: 3, length: 2
      'entire line':
        expected: '<i></i><br>'
        offset: 0, length: 8
      'trailing newline':
        expected: '<b>01</b><i><s>23</s><u>45</u></i><b>67</b>'
        offset: 8, length: 1
      'entire line':
        expected: '<b></b><i><s></s><u></u></i><b></b><br>'
        offset: 0, length: 9

    _.each(tests, (test, name) ->
      it(name, ->
        @line.deleteText(test.offset, test.length)
        expect(@line.node).toEqualHTML(test.expected)
      )
    )
  )

  describe('formatText()', ->
    tests =
      'single node add':
        initial: '<b>01</b><s>23</s><i>45</i>'
        expected: '<b>01</b><s><u>23</u></s><i>45</i>'
        args: [2, 2, 'underline', true]
      'single node remove':
        initial: '<b>01</b><s>23</s><i>45</i>'
        expected: '<b>01</b>23<i>45</i>'
        args: [2, 2, 'strike', false]
      'multiple node add':
        initial: '<b>01</b><s>23</s><i>45</i>'
        expected: '<b><u>01</u></b><s><u>23</u></s><i>45</i>'
        args: [0, 4, 'underline', true]
      'multiple node remove':
        initial: '<b>01</b>23<b>45</b>'
        expected: '012345'
        args: [0, 6, 'bold', false]
      'skip boundaries add':
        initial: '<b>01</b><s>23</s><b>45</b>'
        expected: '<b>01</b><s><b>23</b></s><b>45</b>'
        args: [0, 6, 'bold', true]
      'skip boundaries remove':
        initial: '<i>01</i><b>23</b><i>45</i>'
        expected: '<i>01</i>23<i>45</i>'
        args: [0, 6, 'bold', false]
      'split boundaries add':
        initial: '<i>01</i><s>23</s><i>45</i>'
        expected: '<i>0<b>1</b></i><s><b>23</b></s><i><b>4</b>5</i>'
        args: [1, 4, 'bold', true]
      'split boundaries remove':
        initial: '<b>01</b><b>23</b><b>45</b>'
        expected: '<b>0</b>1234<b>5</b>'
        args: [1, 4, 'bold', false]
      'split boundaries with parents add':
        initial: '<b><i>01</i></b>23<i><b>45</b></i>'
        expected: '<b><i>0<s>1</s></i></b><s>23</s><i><b><s>4</s>5</b></i>'
        args: [1, 4, 'strike', true]
      'split boundaries with parents remove':
        initial: '<b><i>01</i><s>23</s></b><i><s>45</s><b>67</b></i>'
        expected: '<b><i>01</i></b><b><s>2</s></b><s>3</s><i><s>45</s></i><i>6<b>7</b></i>'
        args: [3, 4, 'bold', false]
      'split boundaries with parents remove at beginning':
        initial: '<b><i>01</i><s>23</s></b>'
        expected: '<i>01</i><s>23</s>'
        args: [0, 4, 'bold', false]
      'remove image':
        initial: '<b>01</b><img src="http://quilljs.com/images/cloud.png"><s>34</s>'
        expected: "<b>01</b><s>34</s>"
        args: [2, 1, 'image', false]
      'change format':
        initial: '<b style="color: red;">012</b>'
        expected: '<b style="color: red;">0</b><b style="color: blue;">1</b><b style="color: red;">2</b>'
        args: [1, 1, 'color', 'blue']

    _.each(tests, (test, name) ->
      it(name, ->
        @container.innerHTML = "<div>#{test.initial}</div>"
        lineNode = @container.firstChild
        @line = new Quill.Line(@doc, lineNode)
        @line.formatText(test.args...)
        expect(@line.node).toEqualHTML(test.expected)
      )
    )
  )

  describe('insertText()', ->
    tests =
      'between two nodes':
        initial: '<b>01</b><s>23</s>'
        expected: '<b>01</b>|<s>23</s>'
        offset: 2
      'middle of node':
        initial: '<b>01</b>'
        expected: '<b>0</b>|<b>1</b>'
        offset: 1
      'between two nodes with parent':
        initial: '<b><i>01</i><s>23</s></b>'
        expected: '<b><i>01</i></b>|<b><s>23</s></b>'
        offset: 2
      'inside leaf':
        initial: '01'
        expected: '0|1'
        offset: 1
      'inside leaf with format':
        initial: '<b>01</b>'
        expected: '<b>0|1</b>'
        offset: 1, formats: { bold: true }
      'inside leaf with multiple formats':
        initial: '<b><i>01</i></b>'
        expected: '<b><i>0|1</i></b>'
        offset: 1, formats: { bold: true, italic: true }
      'empty line':
        initial: '<br>'
        expected: '|'
        offset: 0
      'beyond last line':
        initial: '<br>'
        expected: '|'
        offset: 1
      'format in empty line':
        initial: '<br>'
        expected: '<b>|</b><br>'
        offset: 0, formats: { bold: true }
      'void in empty line':
        initial: '<br>'
        expected: '<img src="http://quilljs.com/images/cloud.png"><br>'
        offset: 0, formats: { image: 'http://quilljs.com/images/cloud.png' }
      'void in middle of node':
        initial: '<b>01</b>'
        expected: '<b>0</b><img src="http://quilljs.com/images/cloud.png"><b>1</b>'
        offset: 1, formats: { image: 'http://quilljs.com/images/cloud.png' }
      'line formats ignored':
        initial: 'ab'
        expected: 'a<b>|</b>b'
        offset: 1, formats: { list: true, bold: true }

    _.each(tests, (test, name) ->
      it(name, ->
        @container.innerHTML = "<div>#{test.initial}</div>"
        lineNode = @container.firstChild
        @line = new Quill.Line(@doc, lineNode)
        @line.insertText(test.offset, '|', test.formats)
        expect(@line.node).toEqualHTML(test.expected)
      )
    )

    it('empty string into empty line', ->
      @container.innerHTML = '<div><br></div>'
      lineNode = @container.firstChild
      @line = new Quill.Line(@doc, lineNode)
      @line.insertText(0, '')
      expect(@line.node).toEqualHTML('<br>')
    )
  )
)
