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
      debouncedUpdate() if Tandem.Keyboard.LEFT <= event.which and event.which <= Tandem.Keyboard.DOWN

    @editor.doc.root.addEventListener('keyup', keyUpdate)
    @editor.doc.root.addEventListener('mouseup', debouncedUpdate)
    @editor.doc.root.addEventListener('mousedown', debouncedUpdate)
    @destructors.push( =>
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
    if @range?
      savedSel = rangy.saveSelection(@editor.contentWindow)
      _.each(savedSel.rangeInfos, (rangeInfo) ->
        _.each([rangeInfo.startMarkerId, rangeInfo.endMarkerId, rangeInfo.markerId], (markerId) ->
          marker = rangeInfo.document.getElementById(markerId)
          marker.classList.add(Tandem.Constants.SPECIAL_CLASSES.EXTERNAL) if marker?.classList?
        )
      )
      fn.call(context)
      rangy.restoreSelection(savedSel, false)
      this.update()
    else
      fn.call(context)

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
      @editor.emit(Tandem.Editor.events.SELECTION_CHANGE, range) unless silent
      @range = range



window.Tandem ||= {}
window.Tandem.Selection = TandemSelection

