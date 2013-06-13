describe('Cursor', ->
  describe('basic operations', ->
    initial = '
      <div><b>Bold</b><i>Italic</i></div>
      <div><br></br>
      <div><span style="font-size:18px;">Large</span></div>
    '
    $('#test-container').html(Scribe.Utils.cleanHtml(initial, true))
    editor = new Scribe.Editor('test-container')
    cursorManager = new Scribe.MultiCursor(editor)

    it('should set cursor', ->
      cursorManager.setCursor('id', 2, 'Test', 'red')
      cursor = cursorManager.container.querySelector('.cursor')
      expect(cursor.classList.contains('top')).to.be.true
      inner = cursor.querySelector('.cursor-inner')
      expect(inner.style.backgroundColor).to.equal('red')
      name = cursor.querySelector('.cursor-name')
      expect(name.textContent).to.equal('Test')
    )

    it('should set at middle of leaf', ->
      cursorManager.setCursor('id', 2, 'Test', 'red')
      cursor = cursorManager.container.querySelector('.cursor')
      expect(cursor.style.left).to.equal('17px')
      expect(cursor.style.top).to.equal('0px')
    )

    it('should set at leaf boundary', ->
      cursorManager.setCursor('id', 4, 'Test', 'red')
      cursor = cursorManager.container.querySelector('.cursor')
      expect(cursor.style.left).to.equal('29px')
      expect(cursor.style.top).to.equal('0px')
    )

    it('should set at newline', ->
      cursorManager.setCursor('id', 11, 'Test', 'red')
      cursor = cursorManager.container.querySelector('.cursor')
      expect(cursor.style.left).to.equal('0px')
      expect(cursor.style.top).to.equal('15px')
    )

    it('should set at beginning', ->
      cursorManager.setCursor('id', 0, 'Test', 'red')
      cursor = cursorManager.container.querySelector('.cursor')
      expect(cursor.style.left).to.equal('0px')
      expect(cursor.style.top).to.equal('0px')
    )

    it('should set at end', ->
      cursorManager.setCursor('id', 17, 'Test', 'red')
      cursor = cursorManager.container.querySelector('.cursor')
      expect(cursor.style.left).to.equal('46px')
      expect(cursor.style.top).to.equal('35px')
    )

    it('should set at beginning of large font', ->
      cursorManager.setCursor('id', 12, 'Test', 'red')
      cursor = cursorManager.container.querySelector('.cursor')
      expect(cursor.style.left).to.equal('0px')
      expect(cursor.style.top).to.equal('30px')
      inner = cursor.querySelector('.cursor-inner')
      expect(inner.style.height).to.equal('21px')
    )

    it('should set in middle of large font', ->
      cursorManager.setCursor('id', 14, 'Test', 'red')
      cursor = cursorManager.container.querySelector('.cursor')
      expect(cursor.style.left).to.equal('20px')
      expect(cursor.style.top).to.equal('30px')
      inner = cursor.querySelector('.cursor-inner')
      expect(inner.style.height).to.equal('21px')
    )

    it('should set in end of large font', ->
      cursorManager.setCursor('id', 17, 'Test', 'red')
      cursor = cursorManager.container.querySelector('.cursor')
      expect(cursor.style.left).to.equal('46px')
      expect(cursor.style.top).to.equal('35px')
      inner = cursor.querySelector('.cursor-inner')
    )
  )
)