describe('Cursor', ->
  describe('basic operations', ->
    CURSOR_LEFT = [0, 0]
    CURSOR_END_LEFT = [46, 46]
    CURSOR_FIRST_TOP = [0, 2]
    CURSOR_SECOND_TOP = [19, 21]
    CURSOR_THIRD_TOP = [37, 40]
    LARGE_CURSOR_HEIGHT = [18, 24]

    cursorManager = editor = null

    before((done) ->
      initial =
        '<div>' +
          '<b>Bold</b><i>Italic</i>' +
        '</div>' +
        '<div>' +
          '<br />' +
        '</div>' +
        '<div>' +
          '<span style="font-size:18px;">Large</span>' +
        '</div>'
      $('#test-container').html(Quill.Normalizer.normalizeHtml(initial))
      editor = new Quill('#test-container')
      cursorManager = editor.addModule('multi-cursor')
      _.defer(done)
    )

    it('should set cursor', ->
      cursorManager.setCursor('id', 0, 'Test', 'red')
      cursor = cursorManager.container.querySelector('.cursor')
      expect(Quill.DOM.hasClass(cursor, 'top')).to.be(true)
      expect(Quill.DOM.hasClass(cursor, 'left')).to.be(true)
      inner = cursor.querySelector('.cursor-caret')
      expect(inner.style.backgroundColor).to.equal('red')
      name = cursor.querySelector('.cursor-name')
      expect(Quill.DOM.getText(name)).to.equal('Test')
    )

    it('should set at middle of leaf', ->
      cursorManager.setCursor('id', 2, 'Test', 'red')
      cursor = cursorManager.container.querySelector('.cursor')
      expect(parseInt(cursor.style.left)).to.equal(17)
      expect(parseInt(cursor.style.top)).to.be.within(CURSOR_FIRST_TOP[0], CURSOR_FIRST_TOP[1])
    )

    it('should set at leaf boundary', ->
      cursorManager.setCursor('id', 4, 'Test', 'red')
      cursor = cursorManager.container.querySelector('.cursor')
      expect(parseInt(cursor.style.left)).to.be.within(28, 29)
      expect(parseInt(cursor.style.top)).to.be.within(CURSOR_FIRST_TOP[0], CURSOR_FIRST_TOP[1])
    )

    it('should set at newline', ->
      cursorManager.setCursor('id', 11, 'Test', 'red')
      cursor = cursorManager.container.querySelector('.cursor')
      expect(parseInt(cursor.style.left)).to.equal(CURSOR_LEFT[0])
      expect(parseInt(cursor.style.top)).to.be.within(CURSOR_SECOND_TOP[0], CURSOR_SECOND_TOP[1])
    )

    it('should set at beginning', ->
      cursorManager.setCursor('id', 0, 'Test', 'red')
      cursor = cursorManager.container.querySelector('.cursor')
      expect(parseInt(cursor.style.left)).to.equal(CURSOR_LEFT[0])
      expect(parseInt(cursor.style.top)).to.be.within(CURSOR_FIRST_TOP[0], CURSOR_FIRST_TOP[1])
    )

    it('should set at end', ->
      cursorManager.setCursor('id', 17, 'Test', 'red')
      cursor = cursorManager.container.querySelector('.cursor')
      expect(parseInt(cursor.style.left)).to.equal(CURSOR_END_LEFT[0])
      expect(parseInt(cursor.style.top)).to.be.within(CURSOR_THIRD_TOP[0], CURSOR_THIRD_TOP[1])
    )

    it('should set at beginning of large font', ->
      cursorManager.setCursor('id', 12, 'Test', 'red')
      cursor = cursorManager.container.querySelector('.cursor')
      expect(parseInt(cursor.style.left)).to.equal(CURSOR_LEFT[0])
      expect(parseInt(cursor.style.top)).to.be.within(CURSOR_THIRD_TOP[0], CURSOR_THIRD_TOP[1])
      expect(parseInt(cursor.style.height)).to.be.within(LARGE_CURSOR_HEIGHT[0], LARGE_CURSOR_HEIGHT[1])
    )

    it('should set in middle of large font', ->
      cursorManager.setCursor('id', 14, 'Test', 'red')
      cursor = cursorManager.container.querySelector('.cursor')
      expect(parseInt(cursor.style.left)).to.equal(20)
      expect(parseInt(cursor.style.top)).to.be.within(CURSOR_THIRD_TOP[0], CURSOR_THIRD_TOP[1])
      expect(parseInt(cursor.style.height)).to.be.within(LARGE_CURSOR_HEIGHT[0], LARGE_CURSOR_HEIGHT[1])
    )

    it('should set in end of large font', ->
      cursorManager.setCursor('id', 17, 'Test', 'red')
      # Cursor tested by 'should set at end test'
      cursor = cursorManager.container.querySelector('.cursor')
      expect(parseInt(cursor.style.height)).to.be.within(LARGE_CURSOR_HEIGHT[0], LARGE_CURSOR_HEIGHT[1])
    )

    it('should push cursor', ->
      cursorManager.setCursor('id', 1, 'Test', 'red')
      cursor = cursorManager.container.querySelector('.cursor')
      expect(parseInt(cursor.style.left)).to.equal(9)
      editor.insertText(0, 'A', { bold: true })
      expect(parseInt(cursor.style.left)).to.be.within(18, 19)
      expect(parseInt(cursor.style.top)).to.be.within(CURSOR_FIRST_TOP[0], CURSOR_FIRST_TOP[1])
    )

    it('should append after external edit', ->
      authorshipManager = editor.addModule('authorship', {
        authorId: 'id1'
        color: 'blue'
      })
      editor.insertText(10, 'Y', { author: 'id1' })
      cursorManager.setCursor('id2', 11, 'Test', 'red')
      editor.insertText(11, 'Z', { author: 'id2' })
      cursor = cursorManager.container.querySelector('.cursor')
    )
  )
)