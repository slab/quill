class TandemToolbar extends EventEmitter2
  constructor: (@editor) ->
    @overrides = {}
    @overrideIndex = 0
    @editor.on(Tandem.Editor.events.SELECTION_CHANGE, (selection) =>
      attributes = if selection then selection.getAttributes() else null
      console.info 'selection change', selection, attributes
      this.emit('update', attributes)
      @overrides = {}
    ).on(Tandem.Editor.events.TEXT_CHANGE, (delta) =>
      console.info 'text change', delta
      if _.keys(@overrides).length > 0 and delta.startLength != delta.endLength
        if delta.endLength == delta.startLength + 1
          _.each(@overrides, (value, attribute) =>
            @editor.applyAttribute(@overrideIndex, 1, attribute, value)
          )
        @overrides = {}
        @overrideIndex = 0
    )

  applyAttribute: (name, value) ->
    selection = @editor.getSelection()
    if selection?
      startIndex = selection.start.getIndex()
      endIndex = selection.end.getIndex()
      return unless startIndex? and endIndex?
      if startIndex != endIndex
        @editor.applyAttribute(startIndex, endIndex - startIndex, name, value)
      else
        @overrides[name] = value
        @overrideIndex = startIndex
      selection = @editor.getSelection()    # Update attributes
      attributes = _.extend(selection.getAttributes(), @overrides)
      this.emit('update', attributes)
    else
      console.warn "#{name} called with no selection"
      


window.Tandem ||= {}
window.Tandem.Toolbar = TandemToolbar
