#= require underscore
#= require rangy/rangy-core
#= require tandem/range

class TandemSelection
  @POLL_INTERVAL: 500


  constructor: (@editor) ->
    @destructors = []
    @range = null
    this.initListeners()

  destroy: ->
    _.each(@destructors, (fn) =>
      fn.call(this)
    )
    @destructors = null

  initListeners: ->
    debouncedUpdate = _.debounce( =>
      return if !@destructors?
      this.update()
    , 100)
    keyUpdate = (event) =>
      debouncedUpdate() if 37 <= event.which and event.which <= 40

    @editor.doc.root.addEventListener('keyup', keyUpdate)
    @editor.doc.root.addEventListener('mouseup', debouncedUpdate)
    @editor.doc.root.addEventListener('mousedown', debouncedUpdate)
    #updateInterval = setInterval(debouncedUpdate, TandemSelection.POLL_INTERVAL)
    @destructors.push( =>
      #clearInterval(updateInterval)
      @editor.doc.root.removeEventListener('keyup', keyUpdate)
      @editor.doc.root.removeEventListener('mouseup', debouncedUpdate)
      @editor.doc.root.removeEventListener('mousedown', debouncedUpdate)
    )


  getNative: ->
    rangySel = rangy.getSelection(@editor.contentWindow)
    return null unless rangySel.anchorNode? && rangySel.focusNode?
    if !rangySel.isBackwards()
      [anchorNode, anchorOffset, focusNode, focusOffset] = [rangySel.anchorNode, rangySel.anchorOffset, rangySel.focusNode, rangySel.focusOffset]
    else
      [focusNode, focusOffset, anchorNode, anchorOffset] = [rangySel.anchorNode, rangySel.anchorOffset, rangySel.focusNode, rangySel.focusOffset]
    return {
      anchorNode    : anchorNode
      anchorOffset  : anchorOffset
      focusNode     : focusNode
      focusOffset   : focusOffset
    }

  getRange: ->
    nativeSel = this.getNative()
    return null unless nativeSel?
    start = new Tandem.Position(@editor, nativeSel.anchorNode, nativeSel.anchorOffset)
    end = new Tandem.Position(@editor, nativeSel.focusNode, nativeSel.focusOffset)
    return new Tandem.Range(@editor, start, end)

  preserve: (fn, context = fn) ->
    if @range? && false
      this.save()
      fn.call(context)
      this.restore()
      this.update()
    else
      fn.call(context)

  removeMarkers: ->
    markers = @editor.doc.root.getElementsByClassName('sel-marker')
    _.each(_.clone(markers), (marker) =>
      parent = marker.parentNode
      parent.removeChild(marker)
      parent.normalize()
      line = @editor.doc.findLine(parent)
      line.rebuild() if line?
    )

  restore: ->
    markers = @editor.doc.root.getElementsByClassName('sel-marker')
    startMarker = markers[0]
    endMarker = markers[1]
    if startMarker && endMarker
      startOffset = Tandem.Position.getIndex(startMarker, 0, @editor.doc.root)
      endOffset = Tandem.Position.getIndex(endMarker, 0, @editor.doc.root)
      this.removeMarkers()
      range = new Tandem.Range(@editor, new Tandem.Position(@editor, @editor.doc.root, startOffset), new Tandem.Position(@editor, @editor.doc.root, endOffset))
      this.setRange(range)
    else
      # TODO this should never happen...
      console.warn "Not enough markers", startMarker, endMarker, @editor.id
      this.removeMarkers()

  save: ->
    this.removeMarkers()
    selection = this.getRange()
    if selection
      oldIgnoreDomChange = @editor.ignoreDomChanges
      @editor.ignoreDomChanges = true
      startMarker = @editor.doc.root.ownerDocument.createElement('span')
      startMarker.classList.add('sel-marker')
      startMarker.classList.add(Tandem.Constants.SPECIAL_CLASSES.EXTERNAL)
      endMarker = @editor.doc.root.ownerDocument.createElement('span')
      endMarker.classList.add('sel-marker')
      endMarker.classList.add(Tandem.Constants.SPECIAL_CLASSES.EXTERNAL)
      if selection.start.leafNode == selection.end.leafNode
        selection.end.offset -= selection.start.offset
      Tandem.Utils.insertExternal(selection.start, startMarker)
      Tandem.Utils.insertExternal(selection.end, endMarker)
      @editor.ignoreDomChanges = oldIgnoreDomChange

  setRange: (@range) ->
    rangySel = rangy.getSelection(@editor.contentWindow)
    if @range?
      rangySelRange = @range.getRangy()
      rangySel.setSingleRange(rangySelRange)
    else
      rangySel.removeAllRanges()

  update: (silent = false) ->
    range = this.getRange()
    unless (range == @range) || (@range?.equals(range))
      @editor.emit(Tandem.Editor.events.USER_SELECTION_CHANGE, range) unless silent
      @range = range



window.Tandem ||= {}
window.Tandem.Selection = TandemSelection

