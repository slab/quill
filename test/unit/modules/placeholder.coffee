describe('Placeholder', ->
  beforeEach( ->
    @container = $('#editor-container').html('<div>
      </div>').get(0)
    @quill = new Quill(@container.firstChild,
              modules:
                 'placeholder': {text: 'Enter text'}
            )
  )

  it('placeholder init', () ->
    expect(Quill.DOM.hasClass(@quill.root, 'placeholder-container')).toEqual(true)
  )

  it('placeholder enable disable', () ->
    @textChange = (delta) ->
      if(delta.endLength > 1)
        expect(Quill.DOM.hasClass(@quill.root, 'placeholder-container')).toEqual(false)   
      else
        expect(Quill.DOM.hasClass(@quill.root, 'placeholder-container')).toEqual(true) 
    @quill.on(Quill.events.TEXT_CHANGE, _.bind(this.textChange, this))
    @quill.updateContents(Tandem.Delta.makeInsertDelta(0, 1, 'e'), 'user')
    Quill.DOM.triggerEvent(@quill.root, 'keydown', Quill.Module.UndoManager.hotkeys.UNDO)
  )
)
