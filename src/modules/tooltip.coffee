_          = require('lodash')
DOM        = require('../dom')
Normalizer = require('../normalizer')


class Tooltip
  @DEFAULTS:
    margin: 10
    offset: 10
    styles:
      '.tooltip': {
        'background-color': '#fff'
        'border': '1px solid #000'
        'padding': '5px 10px'
        'white-space': 'nowrap'
      }
    template: ''

  constructor: (@quill, @editorContainer, @options) ->
    @quill.addStyles(@options.styles)
    @container = @quill.addContainer('tooltip')
    @container.innerHTML = Normalizer.stripWhitespace(@options.template)
    @container.style.position = 'absolute'    # Set immediately so style.left has effect to avoid initial flicker
    DOM.addEventListener(@editorContainer, 'focus', _.bind(this.hide, this))
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
    editorRect = @editorContainer.getBoundingClientRect()
    toolbarRect = @container.getBoundingClientRect()
    left = Math.min(editorRect.right - toolbarRect.width - @options.margin, toolbarRect.left)
    left = Math.max(editorRect.left + @options.margin, toolbarRect.left)
    top = Math.min(editorRect.bottom - toolbarRect.height - @options.margin, toolbarRect.top)
    top = Math.max(editorRect.top + @options.margin, toolbarRect.top)
    return [left, top]

  _position: (reference) ->
    toolbarRect = @container.getBoundingClientRect()
    editorRect = @editorContainer.getBoundingClientRect()
    left = editorRect.left + editorRect.width/2 - toolbarRect.width/2
    if reference?
      referenceBounds = reference.getBoundingClientRect()
      top = referenceBounds.top + referenceBounds.height + @options.offset
      if top + toolbarRect.height > editorRect.bottom - @options.margin
        top = referenceBounds.top - referenceBounds.height - @options.offset
    else
      top = editorRect.top + editorRect.height/2 - toolbarRect.height/2
    return [left, top]


module.exports = Tooltip
