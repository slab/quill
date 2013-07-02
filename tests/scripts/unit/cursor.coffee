describe('Cursor', ->
  describe('basic operations', ->
    cursorManager = null
    before((done) ->
      initial = '<div><b>Bold</b><i>Italic</i></div><div><br></br><div><span style="font-size:18px;">Large</span></div>'
      $('#test-container').html(Scribe.Utils.cleanHtml(initial, true))
      editor = new Scribe.Editor('test-container')
      cursorManager = new Scribe.MultiCursor(editor)
      _.defer(done)
    )

    it('should set cursor', ->
      cursorManager.setCursor('id', 2, 'Test', 'red')
      cursor = cursorManager.container.querySelector('.cursor')
      expect(Scribe.DOM.hasClass(cursor, 'top')).to.be.true
      inner = cursor.querySelector('.cursor-inner')
      expect(inner.style.backgroundColor).to.equal('red')
      name = cursor.querySelector('.cursor-name')
      expect(name.textContent).to.equal('Test')
    )

    it('should set at middle of leaf', ->
      cursorManager.setCursor('id', 2, 'Test', 'red')
      cursor = cursorManager.container.querySelector('.cursor')
      expect(cursor.style.left).to.equal('17px')
      expect(parseInt(cursor.style.top)).to.be.gte(0)
      expect(parseInt(cursor.style.top)).to.be.lte(1)
    )

    it('should set at leaf boundary', ->
      cursorManager.setCursor('id', 4, 'Test', 'red')
      cursor = cursorManager.container.querySelector('.cursor')
      expect(cursor.style.left).to.equal('29px')
      expect(parseInt(cursor.style.top)).to.be.gte(0)
      expect(parseInt(cursor.style.top)).to.be.lte(1)
    )

    it('should set at newline', ->
      cursorManager.setCursor('id', 11, 'Test', 'red')
      cursor = cursorManager.container.querySelector('.cursor')
      expect(cursor.style.left).to.equal('0px')
      expect(parseInt(cursor.style.top)).to.be.gte(15)
      expect(parseInt(cursor.style.top)).to.be.lte(16)
    )

    it('should set at beginning', ->
      cursorManager.setCursor('id', 0, 'Test', 'red')
      cursor = cursorManager.container.querySelector('.cursor')
      expect(cursor.style.left).to.equal('0px')
      expect(parseInt(cursor.style.top)).to.be.gte(0)
      expect(parseInt(cursor.style.top)).to.be.lte(1)
    )

    it('should set at end', ->
      cursorManager.setCursor('id', 17, 'Test', 'red')
      cursor = cursorManager.container.querySelector('.cursor')
      expect(cursor.style.left).to.equal('46px')
      expect(parseInt(cursor.style.top)).to.be.gte(29)
      expect(parseInt(cursor.style.top)).to.be.lte(31)
    )

    it('should set at beginning of large font', ->
      cursorManager.setCursor('id', 12, 'Test', 'red')
      cursor = cursorManager.container.querySelector('.cursor')
      expect(cursor.style.left).to.equal('0px')
      expect(parseInt(cursor.style.top)).to.be.gte(29)
      expect(parseInt(cursor.style.top)).to.be.lte(31)
      inner = cursor.querySelector('.cursor-inner')
      expect(parseInt(inner.style.height)).to.be.gte(18)
      expect(parseInt(inner.style.height)).to.be.lte(21)
    )

    it('should set in middle of large font', ->
      cursorManager.setCursor('id', 14, 'Test', 'red')
      cursor = cursorManager.container.querySelector('.cursor')
      expect(cursor.style.left).to.equal('20px')
      expect(parseInt(cursor.style.top)).to.be.gte(29)
      expect(parseInt(cursor.style.top)).to.be.lte(31)
      inner = cursor.querySelector('.cursor-inner')
      expect(parseInt(inner.style.height)).to.be.gte(18)
      expect(parseInt(inner.style.height)).to.be.lte(21)
    )

    it('should set in end of large font', ->
      cursorManager.setCursor('id', 17, 'Test', 'red')
      # Cursor tested by 'should set at end test'
      inner = cursorManager.container.querySelector('.cursor-inner')
      expect(parseInt(inner.style.height)).to.be.gte(18)
      expect(parseInt(inner.style.height)).to.be.lte(21)
    )
  )
)