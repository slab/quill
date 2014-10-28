Quill      = require('../quill')
Normalizer = require('../lib/normalizer')
_          = Quill.require('lodash')
dom        = Quill.require('dom')


class Tooltip
  @DEFAULTS:
    offset: 10
    template: ''

  @HIDE_MARGIN = '-10000px'

  constructor: (@quill, @options) ->
    @container = @quill.addContainer('ql-tooltip')
    @container.innerHTML = Normalizer.stripWhitespace(@options.template)
    dom(@quill.root).on('focus', _.bind(this.hide, this))
    this.hide()
    @quill.on(@quill.constructor.events.TEXT_CHANGE, (delta, source) =>
      if source == 'user' and @container.style.left != Tooltip.HIDE_MARGIN
        @range = null
        this.hide()
    )

  initTextbox: (textbox, enterCallback, escapeCallback) ->
    dom(textbox).on('keyup', (event) =>
      switch event.which
        when dom.KEYS.ENTER  then enterCallback.call(this)
        when dom.KEYS.ESCAPE then escapeCallback.call(this)
        else return true
    )

  hide: ->
    @container.style.left = Tooltip.HIDE_MARGIN
    @quill.setSelection(@range) if @range
    @range = null

  show: (reference) ->
    @range = @quill.getSelection()
    [left, top] = this._position(reference)
    [left, top] = this._limit(left, top)
    left += window.pageXOffset
    top += window.pageYOffset
    @container.style.left = "#{left}px"
    @container.style.top = "#{top}px"
    @container.focus()

  _getBounds: ->
    bounds = @quill.root.getBoundingClientRect()
    scrollX = window.pageXOffset
    scrollY = window.pageYOffset
    return {
      left:   bounds.left + scrollX
      right:  bounds.right + scrollX
      top:    bounds.top + scrollY
      bottom: bounds.bottom + scrollY
      width:  bounds.width
      height: bounds.height
    }

  _limit: (left, top) ->
    editorRect = this._getBounds()
    toolbarRect = @container.getBoundingClientRect()
    left = Math.min(editorRect.right - toolbarRect.width, left)   # right boundary
    left = Math.max(editorRect.left, left)                        # left boundary
    top = Math.min(editorRect.bottom - toolbarRect.height, top)   # bottom boundary
    top = Math.max(editorRect.top, top)                           # top boundary
    return [left, top]

  _position: (reference) ->
    toolbarRect = @container.getBoundingClientRect()
    editorRect = this._getBounds()
    if reference?
      referenceBounds = reference.getBoundingClientRect()
      left = referenceBounds.left + referenceBounds.width/2 - toolbarRect.width/2
      top = referenceBounds.top + referenceBounds.height + @options.offset
      if top + toolbarRect.height > editorRect.bottom
        top = referenceBounds.top - toolbarRect.height - @options.offset
    else
      left = editorRect.left + editorRect.width/2 - toolbarRect.width/2
      top = editorRect.top + editorRect.height/2 - toolbarRect.height/2
    return [left, top]


Quill.registerModule('tooltip', Tooltip)
module.exports = Tooltip
