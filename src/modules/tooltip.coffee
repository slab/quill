_          = require('lodash')
DOM        = require('../dom')
Normalizer = require('../normalizer')


class Tooltip
  @DEFAULTS:
    offset: 10
    styles:
      '.tooltip':
        'background-color': '#fff'
        'border': '1px solid #000'
        'white-space': 'nowrap'
      '.tooltip a':
        'cursor': 'pointer'
        'text-decoration': 'none'
    template: ''

  constructor: (@quill, @options) ->
    @quill.addStyles(@options.styles)
    @container = @quill.addContainer('tooltip')
    @container.innerHTML = Normalizer.stripWhitespace(@options.template)
    @container.style.position = 'absolute'    # Set immediately so style.left has effect to avoid initial flicker
    DOM.addEventListener(@quill.root, 'focus', _.bind(this.hide, this))
    this.hide()

  hide: ->
    @container.style.left = '-10000px'
    @quill.setSelection(@range) if @range
    @range = null

  show: (reference) ->
    @range = @quill.getSelection()
    [left, top] = this._position(reference)
    [left, top] = this._limit(left, top)
    @container.style.left = "#{left}px"
    @container.style.top = "#{top}px"
    @container.focus()

  _limit: (left, top) ->
    editorRect = @quill.root.getBoundingClientRect()
    toolbarRect = @container.getBoundingClientRect()
    left = Math.min(editorRect.right - toolbarRect.width, left)   # right boundary
    left = Math.max(editorRect.left, left)                        # left boundary
    top = Math.min(editorRect.bottom - toolbarRect.height, top)   # bottom boundary
    top = Math.max(editorRect.top, top)                           # top boundary
    return [left, top]

  _position: (reference) ->
    toolbarRect = @container.getBoundingClientRect()
    editorRect = @quill.root.getBoundingClientRect()
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


module.exports = Tooltip
