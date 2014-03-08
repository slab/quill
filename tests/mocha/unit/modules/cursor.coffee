expect = require('expect.js')


describe('Cursor', ->
  describe('basic operations', ->
    cursorManager = editor = null
    offsetLeft = 15
    offsetTop = 10
    before((done) ->
      initial = '<div><b>Bold</b><i>Italic</i></div><div><br /><div><span style="font-size:18px;">Large</span></div>'
      $('#test-container').html(Scribe.Normalizer.normalizeHtml(initial))
      editor = new Scribe('#test-container')
      cursorManager = editor.addModule('multi-cursor')
      _.defer(done)
    )

    it('should set cursor', ->
      cursorManager.setCursor('id', 2, 'Test', 'red')
      cursor = cursorManager.container.querySelector('.cursor')
      expect(Scribe.DOM.hasClass(cursor, 'top')).to.be(true)
      inner = cursor.querySelector('.cursor-caret')
      expect(inner.style.backgroundColor).to.equal('red')
      name = cursor.querySelector('.cursor-name')
      expect(Scribe.DOM.getText(name)).to.equal('Test')
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
      expect(parseInt(cursor.style.top) - offsetTop).to.be.within(28, 31)
    )

    it('should set at beginning of large font', ->
      cursorManager.setCursor('id', 12, 'Test', 'red')
      cursor = cursorManager.container.querySelector('.cursor')
      expect(parseInt(cursor.style.left) - offsetLeft).to.equal(0)
      expect(parseInt(cursor.style.top) - offsetTop).to.be.within(28, 31)
      expect(parseInt(cursor.style.height)).to.be.within(18, 24)
    )

    it('should set in middle of large font', ->
      cursorManager.setCursor('id', 14, 'Test', 'red')
      cursor = cursorManager.container.querySelector('.cursor')
      expect(parseInt(cursor.style.left) - offsetLeft).to.equal(20)
      expect(parseInt(cursor.style.top) - offsetTop).to.be.within(28, 31)
      expect(parseInt(cursor.style.height)).to.be.within(18, 24)
    )

    it('should set in end of large font', ->
      cursorManager.setCursor('id', 17, 'Test', 'red')
      # Cursor tested by 'should set at end test'
      cursor = cursorManager.container.querySelector('.cursor')
      expect(parseInt(cursor.style.height)).to.be.within(18, 24)
    )

    it('should push cursor', ->
      cursorManager.setCursor('id', 1, 'Test', 'red')
      cursor = cursorManager.container.querySelector('.cursor')
      expect(cursor.style.left).to.equal('24px')
      editor.insertText(0, 'A', { bold: true })
      expect(parseInt(cursor.style.left) - offsetLeft).to.be.within(18, 19)
      expect(parseInt(cursor.style.top) - offsetTop).to.be.within(-1, 1)
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