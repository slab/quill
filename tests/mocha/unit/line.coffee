describe('Line', ->
  beforeEach( ->
    @container = $('#test-container').html('<div></div>').get(0).firstChild
    @doc = new Quill.Document(@container, { formats: Quill.DEFAULTS.formats })
  )

  describe('constructor', ->
    tests =
      'no children':
        html: '<div style="text-align: right;"></div>'
        format: { align: 'right' }
        leaves: []
      'empty child':
        html: '<div><b></b></div>'
        leaves: [{ text: '', formats: { bold: true } }]
      'leaf child':
        html: '<div><b>Bold</b></div>'
        leaves: [{ text: 'Bold', formats: { bold: true } }]
      'nested leaf child':
        html: '<div><s><b>Bold</b></s></div>'
        leaves: [{ text: 'Bold', formats: { bold: true, strike: true } }]
      'media child':
        html: '<div><img src="http://quilljs.com/images/icon.png"></div>'
        leaves: [{ text: Quill.Format.MEDIA_TEXT, formats: { image: 'http://quilljs.com/images/icon.png' } }]
      'break child':
        html: '<div><br></div>'
        leaves: [{ text: '', formats: {} }]
      'lots of children':
        html: '<div><b><i>A</i><s>B</s></b><img src="http://quilljs.com/images/icon.png"><u>D</u></div>'
        leaves: [
          { text: 'A', formats: { bold: true, italic: true } }
          { text: 'B', formats: { bold: true, strike: true } }
          { text: Quill.Format.MEDIA_TEXT, formats: { image: 'http://quilljs.com/images/icon.png' } }
          { text: 'D', formats: { underline: true } }
        ]

    _.each(tests, (test, name) ->
      it(name, ->
        @container.innerHTML = test.html
        lineNode = @container.firstChild
        line = new Quill.Line(@doc, lineNode)
        expect(line.node).to.equal(lineNode)
        expect(line.leaves.length).to.equal(test.leaves.length)
        length = _.reduce(test.leaves, (length, leaf) ->
          return length + leaf.text.length
        , 0)
        expect(line.length).to.equal(length)
        leaves = line.leaves.toArray()
        _.each(leaves, (leaf, i) ->
          expect(leaf.text).to.equal(test.leaves[i].text)
          expect(leaf.formats).to.eql(test.leaves[i].formats)
        )
      )
    )
  )

  describe('findLeaf()', ->
    tests =
      'child leaf':
        html: '<b>Bold</b><i><s>Strike</s><u>Under</u></i>'
        match: true, query: 's'
      'leaf parent':
        html: '<b>Bold</b><i><s>Strike</s><u>Under</u></i>'
        match: false, query: 'i'
      'break leaf':
        html: '<br>'
        match: true, query: 'br'
      'no match':
        html: '<b>Bold</b><i><s>Strike</s><u>Under</u></i>'
        match: false, query: $('#expected-container').get(0)
      'line with no leaves':
        html: ''
        match: false, query: $('#expected-container').get(0)

    _.each(tests, (test, name) ->
      it(name, ->
        @container.innerHTML = "<div>#{test.html}</div>"
        lineNode = @container.firstChild
        line = new Quill.Line(@doc, lineNode)
        queryNode = if _.isString(test.query) then @container.querySelector(test.query) else test.query
        leaf = line.findLeaf(queryNode)
        if test.match
          expect(leaf.node).to.equal(queryNode)
        else
          expect(leaf).to.be(null)
      )
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
        expected: [null, 2]
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
      'leaf with parent':
        html: '<b>0123</b><i><s>4567</s><u>8901</u></i>'
        offset: 6
        expected: ['s', 2]
      'leaf at boundary with parent':
        html: '<b>0123</b><i><s>4567</s><u>8901</u></i>'
        offset: 8
        expected: ['u', 0]
      'beyond line':
        html: '<b>0123</b><i>4567</i>'
        offset: 10
        expected: [null, 2]

    _.each(tests, (test, name) ->
      it(name, ->
        @container.innerHTML = "<div>#{test.html}</div>"
        lineNode = @container.firstChild
        line = new Quill.Line(@doc, lineNode)
        [leaf, offset] = line.findLeafAt(test.offset)
        if test.expected[0]
          expect(leaf.node).to.equal(lineNode.querySelector(test.expected[0]))
        else
          expect(leaf).to.be(null)
        expect(offset).to.equal(test.expected[1])
      )
    )
  )

  describe('format()', ->
    tests =
      'add text align':
        initial: '<div></div>'
        expected: '<div style="text-align: right;"></div>'
        formats: { align: 'right' }
      'add different text align':
        initial: '<div style="text-align: right;"></div>'
        expected: '<div style="text-align: center;"></div>'
        formats: { align: 'center' }
      'remove text align':
        initial: '<div style="text-align: right;"></div>'
        expected: '<div></div>'
        formats: { align: false }
      'add bold':
        initial: '<div></div>'
        expected: '<div></div>'
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
        expect(line.formats).to.eql(expectedFormats)
        node = line.node.cloneNode(true)
        Quill.DOM.clearAttributes(node, ['style'])
        expect.equalHTML(node.outerHTML, test.expected)
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
        expected: '<b>01</b><i><u>45</u></i><b>67</b>'
        offset: 2, length: 2
      'part of multiple nodes':
        expected: '<b>01</b><i><s>2</s><u>5</u></i><b>67</b>'
        offset: 3, length: 2
      'entire line':
        expected: '<i></i><br>'
        offset: 0, length: 8

    _.each(tests, (test, name) ->
      it(name, ->
        @line.deleteText(test.offset, test.length)
        expect.equalHTML(@line.node, test.expected)
      )
    )
  )

  describe('formatText()', ->
    tests =
      'single node add':
        initial: '<b>01</b><s>23</s><i>45</i>'
        expected: '<b>01</b><u><s>23</s></u><i>45</i>'
        args: [2, 2, 'underline', true]
      'single node remove':
        initial: '<b>01</b><s>23</s><i>45</i>'
        expected: '<b>01</b><span>23</span><i>45</i>'
        args: [2, 2, 'strike', false]
      'multiple node add':
        initial: '<b>01</b><s>23</s><i>45</i>'
        expected: '<u><b>01</b></u><u><s>23</s></u><i>45</i>'
        args: [0, 4, 'underline', true]
      'multiple node remove':
        initial: '<b>01</b><span>23</span><b>45</b>'
        expected: '<span>01</span><span>23</span><span>45</span>'
        args: [0, 6, 'bold', false]
      'skip boundaries add':
        initial: '<b>01</b><s>23</s><b>45</b>'
        expected: '<b>01</b><b><s>23</s></b><b>45</b>'
        args: [0, 6, 'bold', true]
      'skip boundaries remove':
        initial: '<span>01</span><b>23</b><span>45</span>'
        expected: '<span>01</span><span>23</span><span>45</span>'
        args: [0, 6, 'bold', false]
      'split boundaries add':
        initial: '<span>01</span><s>23</s><span>45</span>'
        expected: '<span>0</span><b><span>1</span></b><b><s>23</s></b><b><span>4</span></b><span>5</span>'
        args: [1, 4, 'bold', true]
      'split boundaries remove':
        initial: '<b>01</b><b>23</b><b>45</b>'
        expected: '<b>0</b><span>1</span><span>23</span><span>4</span><b>5</b>'
        args: [1, 4, 'bold', false]
      'split boundaries with parents add':
        initial: '<b><i>01</i></b><span>23</span><i><b>45</b></i>'
        expected: '<b><i>0</i><s><i>1</i></s></b><s><span>23</span></s><i><s><b>4</b></s><b>5</b></i>'
        args: [1, 4, 'strike', true]
      'split boundaries with parents remove':
        initial: '<b><i>01</i><s>23</s></b><i><s>45</s><b>67</b></i>'
        expected: '<b><i>01</i></b><b><s>2</s></b><span><s>3</s></span><i><s>45</s><span>6</span><b>7</b></i>'
        args: [3, 4, 'bold', false]
      'remove image':
        initial: '<b>01</b><img src="http://quilljs.com/images/icon.png"><s>34</s>'
        expected: "<b>01</b><span>#{Quill.Format.MEDIA_TEXT}</span><s>34</s>"
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
        expect.equalHTML(@line.node, test.expected)
      )
    )
  )

  describe('insertText()', ->
    tests =
      'between two nodes':
        initial: '<b>01</b><s>23</s>'
        expected: '<b>01</b><span>|</span><s>23</s>'
        offset: 2
      'middle of node':
        initial: '<b>01</b>'
        expected: '<b>0</b><span>|</span><b>1</b>'
        offset: 1
      'between two nodes with parent':
        initial: '<b><i>01</i><s>23</s></b>'
        expected: '<b><i>01</i></b><span>|</span><b><s>23</s></b>'
        offset: 2
      'inside leaf':
        initial: '<span>01</span>'
        expected: '<span>0|1</span>'
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
        expected: '<span>|</span><br>'
        offset: 0
      'format in empty line':
        initial: '<br>'
        expected: '<b>|</b><br>'
        offset: 0, formats: { bold: true }
      'void in empty line':
        initial: '<br>'
        expected: '<img src="http://quilljs.com/images/icon.png"><br>'
        offset: 0, formats: { image: 'http://quilljs.com/images/icon.png' }
      'void in middle of node':
        initial: '<b>01</b>'
        expected: '<b>0</b><img src="http://quilljs.com/images/icon.png"><b>1</b>'
        offset: 1, formats: { image: 'http://quilljs.com/images/icon.png' }

    _.each(tests, (test, name) ->
      it(name, ->
        @container.innerHTML = "<div>#{test.initial}</div>"
        lineNode = @container.firstChild
        @line = new Quill.Line(@doc, lineNode)
        @line.insertText(test.offset, '|', test.formats)
        expect.equalHTML(@line.node, test.expected)
      )
    )
  )
)
