describe('Tooltip', ->
  makeBounder = (left, top, width, height) ->
    return {
      getBoundingClientRect: ->
        return { left: left, top: top, right: left + width, bottom: top + height, width: width, height: height }
    }

  beforeEach( ->
    @container = $('#editor-container').html('<div></div>').get(0)
    @quill = new Quill(@container.firstChild)
    @tooltip = @quill.addModule('tooltip', { offset: 20 })
  )

  describe('show/hide', ->
    it('restore range', ->
      @quill.setSelection(0, 0)
      @tooltip.show()
      @tooltip.container.focus()
      @tooltip.hide()
      range = @quill.getSelection()
      expect(range.start).toEqual(0)
      expect(range.end).toEqual(0)
    )
  )

  xdescribe('position()', ->
    beforeEach( ->
      @quill.root = makeBounder(50, 50, 600, 400)
      @quill.root.ownerDocument = @tooltip.container.ownerDocument
      @tooltip.container = makeBounder(60, 60, 200, 100)
    )

    it('no reference', ->
      [left, top] = @tooltip.position()
      expect(left).toEqual(250)
      expect(top).toEqual(200)
    )

    it('place below', ->
      reference = makeBounder(100, 100, 100, 50)
      [left, top] = @tooltip.position(reference)
      expect(left).toEqual(50)
      expect(top).toEqual(170)
    )

    it('place above', ->
      reference = makeBounder(100, 500, 100, 50)
      [left, top] = @tooltip.position(reference)
      expect(left).toEqual(50)
      expect(top).toEqual(380)
    )
  )
)
