Quill      = require('../quill')
_          = Quill.require('lodash')
dom        = Quill.require('dom')


class Tooltip
  @DEFAULTS:
    offset: 10
    template: ''

  @HIDE_MARGIN = '-10000px'

  constructor: (@quill, @options) ->
    @container = @quill.addContainer('ql-tooltip')
    @container.innerHTML = @options.template
    this.hide()
    @quill.on(@quill.constructor.events.TEXT_CHANGE, (delta, source) =>
      if @container.style.left != Tooltip.HIDE_MARGIN
        @range = null
        this.hide()
    )

  initTextbox: (textbox, enterCallback, escapeCallback) ->
    dom(textbox).on('keydown', (event) =>
      switch event.which
        when dom.KEYS.ENTER
          event.preventDefault()
          enterCallback.call(this)
        when dom.KEYS.ESCAPE
          event.preventDefault()
          escapeCallback.call(this)
        else
          return true
    )

  hide: ->
    @container.style.left = Tooltip.HIDE_MARGIN
    @quill.setSelection(@range) if @range
    @range = null

  position: (reference) ->
    if reference?
      # Place tooltip under reference centered
      # reference might be selection range so must use getBoundingClientRect()
      tooltipBounds = @container.getBoundingClientRect()
      referenceBounds = reference.getBoundingClientRect()
      parentBounds = @quill.container.getBoundingClientRect()
      offsetLeft = referenceBounds.left - parentBounds.left
      offsetTop = referenceBounds.top - parentBounds.top
      left = offsetLeft + referenceBounds.width/2 - tooltipBounds.width/2
      top = offsetTop + referenceBounds.height + @options.offset
      if top + tooltipBounds.height > parentBounds.height
        top = offsetTop - tooltipBounds.height - @options.offset
      left = Math.max(-parentBounds.left, Math.min(left, parentBounds.width - tooltipBounds.width))
      top = Math.max(-parentBounds.top, Math.min(top, parentBounds.height - tooltipBounds.height))
    else
      # Place tooltip in middle of editor viewport
      left = @quill.container.offsetWidth/2 - @container.offsetWidth/2
      top = @quill.container.offsetHeight/2 - @container.offsetHeight/2
    top += @quill.container.scrollTop
    return [left, top]

  show: (reference) ->
    @range = @quill.getSelection()
    [left, top] = this.position(reference)
    @container.style.left = "#{left}px"
    @container.style.top = "#{top}px"
    @container.focus()


Quill.registerModule('tooltip', Tooltip)
module.exports = Tooltip
