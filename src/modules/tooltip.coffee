Quill = require('../quill')
keys = require('../lib/keys')


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
      this.hide() if @container.style.left != Tooltip.HIDE_MARGIN
    )

  initTextbox: (textbox, enterCallback, escapeCallback) ->
    textbox.addEventListener('keydown', (e) =>
      return unless e.which == keys.ENTER || e.which == keys.ESCAPE
      fn = if e.which == keys.ENTER then enterCallback else escapeCallback
      fn.call(this)
      e.preventDefault()
    )

  hide: ->
    @container.style.left = Tooltip.HIDE_MARGIN
    @quill.focus()

  position: (reference) ->
    if reference?
      # Place tooltip under reference centered
      # reference might be selection range so must use getBoundingClientRect()
      referenceBounds = reference.getBoundingClientRect()
      parentBounds = @quill.container.getBoundingClientRect()
      offsetLeft = referenceBounds.left - parentBounds.left
      offsetTop = referenceBounds.top - parentBounds.top
      offsetBottom = referenceBounds.bottom - parentBounds.bottom
      left = offsetLeft + referenceBounds.width/2 - @container.offsetWidth/2
      top = offsetTop + referenceBounds.height + @options.offset
      if top + @container.offsetHeight > @quill.container.offsetHeight
        top = offsetTop - @container.offsetHeight - @options.offset
      left = Math.max(0, Math.min(left, @quill.container.offsetWidth - @container.offsetWidth))
      top = Math.max(0, Math.min(top, @quill.container.offsetHeight - @container.offsetHeight))
    else
      # Place tooltip in middle of editor viewport
      left = @quill.container.offsetWidth/2 - @container.offsetWidth/2
      top = @quill.container.offsetHeight/2 - @container.offsetHeight/2
    top += @quill.container.scrollTop
    return [left, top]

  show: (reference) ->
    [left, top] = this.position(reference)
    @container.style.left = "#{left}px"
    @container.style.top = "#{top}px"
    @container.focus()


Quill.registerModule('tooltip', Tooltip)
module.exports = Tooltip
