describe('Tooltip', ->
  makeBounder = (left, top, width, height, scrollTop = 0) ->
    return {
      getBoundingClientRect: ->
        return { left: left, top: top, right: left + width, bottom: top + height, width: width, height: height }
    }

  beforeEach( ->
    resetContainer()
    @container = $('#test-container').html('<div></div>').get(0)
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

  describe('position()', ->
    beforeEach( ->
      $(@quill.container).css({ width: 600, height: 400 })
      $(@tooltip.container).css({ width: 200, height: 100 })

    )

    it('no reference', ->
      [left, top] = @tooltip.position()
      expect(left).toEqual(200)
      expect(top).toEqual(150)
    )

    it('place below', ->
      reference = @quill.addContainer('ql-reference')
      $(reference).css({ position: 'absolute', top: '100px', left: '200px', width: '100px', height: '50px' })
      [left, top] = @tooltip.position(reference)
      expect(left).toEqual(150)
      expect(top).toEqual(170)    # ref top + ref height + offset
    )

    it('place above', ->
      reference = @quill.addContainer('ql-reference')
      $(reference).css({ position: 'absolute', top: '350px', left: '200px', width: '100px', height: '50px' })
      [left, top] = @tooltip.position(reference)
      expect(left).toEqual(150)
      expect(top).toEqual(230)    # ref top - tooltip height - offset
    )
  )
)
