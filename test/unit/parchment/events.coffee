Delta = require('rich-text/lib/delta')
Quill = require('../../../src/quill')

describe('Events', ->
  describe('Editor', ->
    beforeEach( ->
      @container.innerHTML = '<p>0123</p>'
      @quill = new Quill(@container)
      @spy =
        onText: ->
      @quill.on(Quill.events.TEXT_CHANGE, @spy.onText)
      spyOn(@spy, 'onText')
    )

    it('insert text', ->
      @quill.insertText(2, '!')
      expect(@spy.onText.calls.count()).toBe(1)
      expect(@spy.onText.calls.mostRecent().args[0]).toEqualDelta(
        new Delta().retain(2).insert('!')
      )
      expect(@spy.onText.calls.mostRecent().args[1]).toBe(Quill.sources.API)
    )
  )
)
