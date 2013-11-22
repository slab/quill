describe('Cursor', ->
  describe('basic operations', ->
    cursorManager = editor = null
    offsetLeft = 15
    offsetTop = 10
    before((done) ->
      initial = '<div><b>Bold</b><i>Italic</i></div><div><br /><div><span style="font-size:18px;">Large</span></div>'
      $('#test-container').html(ScribeNormalizer.normalizeHtml(initial))
      editor = new ScribeEditor('test-container')
      cursorManager = new ScribeMultiCursor(editor)
      _.defer(done)
    )

    it('should set cursor', ->
      cursorManager.setCursor('id', 2, 'Test', 'red')
      cursor = cursorManager.container.querySelector('.cursor')
      expect(ScribeDOM.hasClass(cursor, 'top')).to.be(true)
      inner = cursor.querySelector('.cursor-caret')
      expect(inner.style.backgroundColor).to.equal('red')
      name = cursor.querySelector('.cursor-name')
      expect(ScribeDOM.getText(name)).to.equal('Test')
    )

    it('should set at middle of leaf', ->
      cursorManager.setCursor('id', 2, 'Test', 'red')
      cursor = cursorManager.container.querySelector('.cursor')
      expect(parseInt(cursor.style.left) - offsetLeft).to.equal(17)
      expect(parseInt(cursor.style.top) - offsetTop).to.be.within(-1, 1)
    )

    it('should set at leaf boundary', ->
      cursorManager.setCursor('id', 4, 'Test', 'red')
      cursor = cursorManager.container.querySelector('.cursor')
      expect(parseInt(cursor.style.left) - offsetLeft).to.be.within(28, 29)
      expect(parseInt(cursor.style.top) - offsetTop).to.be.within(-1, 1)
    )

    it('should set at newline', ->
      cursorManager.setCursor('id', 11, 'Test', 'red')
      cursor = cursorManager.container.querySelector('.cursor')
      expect(parseInt(cursor.style.left) - offsetLeft).to.equal(0)
      expect(parseInt(cursor.style.top) - offsetTop).to.be.within(14, 16)
    )

    it('should set at beginning', ->
      cursorManager.setCursor('id', 0, 'Test', 'red')
      cursor = cursorManager.container.querySelector('.cursor')
      expect(parseInt(cursor.style.left) - offsetLeft).to.equal(0)
      expect(parseInt(cursor.style.top) - offsetTop).to.be.within(-1, 1)
    )

    it('should set at end', ->
      cursorManager.setCursor('id', 17, 'Test', 'red')
      cursor = cursorManager.container.querySelector('.cursor')
      expect(cursor.style.left).to.equal('61px')
      expect(parseInt(cursor.style.top) - offsetTop).to.be.within(29, 31)
    )

    it('should set at beginning of large font', ->
      cursorManager.setCursor('id', 12, 'Test', 'red')
      cursor = cursorManager.container.querySelector('.cursor')
      expect(parseInt(cursor.style.left) - offsetLeft).to.equal(0)
      expect(parseInt(cursor.style.top) - offsetTop).to.be.within(29, 31)
      expect(parseInt(cursor.style.height)).to.be.within(18, 22)
    )

    it('should set in middle of large font', ->
      cursorManager.setCursor('id', 14, 'Test', 'red')
      cursor = cursorManager.container.querySelector('.cursor')
      expect(parseInt(cursor.style.left) - offsetLeft).to.equal(20)
      expect(parseInt(cursor.style.top) - offsetTop).to.be.within(29, 31)
      expect(parseInt(cursor.style.height)).to.be.within(18, 22)
    )

    it('should set in end of large font', ->
      cursorManager.setCursor('id', 17, 'Test', 'red')
      # Cursor tested by 'should set at end test'
      cursor = cursorManager.container.querySelector('.cursor')
      expect(parseInt(cursor.style.height)).to.be.within(18, 22)
    )

    it('should push cursor', ->
      cursorManager.setCursor('id', 1, 'Test', 'red')
      cursor = cursorManager.container.querySelector('.cursor')
      expect(cursor.style.left).to.equal('24px')
      editor.insertAt(0, 'A', { bold: true })
      expect(parseInt(cursor.style.left) - offsetLeft).to.be.within(18, 19)
      expect(parseInt(cursor.style.top) - offsetTop).to.be.within(-1, 1)
    )

    it('should append after external edit', ->
      attributionManager = new ScribeAttribution(editor, 'id1', 'blue')
      editor.insertAt(10, 'Y', { author: 'id1' })
      cursorManager.setCursor('id2', 11, 'Test', 'red')
      editor.insertAt(11, 'Z', { author: 'id2' })
      cursor = cursorManager.container.querySelector('.cursor')
    )
  )
)