Scribe = require('../scribe')


enterEditMode = (url) ->
  url = 'https://' + url unless /^http[s]?:\/\//.test(url)
  @tooltipInput.value = url
  Scribe.DOM.addClass(@tooltip, 'editing')

exitEditMode = ->
  if @tooltipLink.innerText != @tooltipInput.value
    @tooltipLink.innerText = @tooltipLink.href = @tooltipInput.value
    @editor.setSelection(@savedRange, true)
    @editor.selection.format('link', @tooltipInput.value, { source: 'user' })
    @toolbar.emit(Scribe.Toolbar.events.FORMAT, 'link', @tooltipInput.value)
    @editor.setSelection(null, true)
  Scribe.DOM.removeClass(@tooltip, 'editing')

hideTooltip = ->
  @tooltip.style.left = '-10000px'

initListeners = ->
  @editor.root.addEventListener('click', (event) =>
    link = event.target
    while link? and link.tagName != 'DIV' and link.tagName != 'BODY'
      if link.tagName == 'A'
        start = new Scribe.Position(@editor, link, 0)
        end = new Scribe.Position(@editor, link, link.textContent.length)
        @savedRange = new Scribe.Range(@editor, start, end)
        @tooltipLink.innerText = @tooltipLink.href = link.href
        Scribe.DOM.removeClass(@tooltip, 'editing')
        showTooptip.call(this, link, @tooltip.offsetParent, @editor.root)
        return
      link = link.parentNode
    hideTooltip.call(this)
  )
  @button.addEventListener('click', =>
    value = null
    if Scribe.DOM.hasClass(@button, 'active')
      value = false
    else
      @savedRange = @editor.selection.getRange()
      url = @savedRange.getText()
      if /\w+\.\w+/.test(url)
        value = url
      else
        enterEditMode.call(this, url)
        Scribe.DOM.addClass(@tooltip, 'editing')
        showTooptip.call(this, @editor.selection.getDimensions(), @tooltip.offsetParent, @editor.root)
        @tooltipInput.focus()
    if value?
      @editor.selection.format('link', value, { source: 'user' })
      @toolbar.emit(Scribe.Toolbar.events.FORMAT, 'link', value)
  )
  @tooltipChange.addEventListener('click', =>
    enterEditMode.call(this, @tooltipLink.innerText)
  )
  @tooltipDone.addEventListener('click', =>
    exitEditMode.call(this)
  )
  @tooltipInput.addEventListener('keyup', (event) =>
    exitEditMode.call(this) if event.which == Scribe.Keyboard.KEYS.ENTER
  )

initTooltip = ->
  @tooltip = @button.ownerDocument.createElement('div')
  @tooltip.id = 'link-tooltip'
  @tooltip.innerHTML =
   '<span class="title">Visit URL:</span>
    <a href="#" class="url" target="_blank" href="about:blank"></a>
    <input class="input" type="text">
    <span>&#45;</span>
    <a href="javascript:;" class="change">Change</a>
    <a href="javascript:;" class="done">Done</a>'
  @tooltipLink = @tooltip.querySelector('.url')
  @tooltipInput = @tooltip.querySelector('.input')
  @tooltipChange = @tooltip.querySelector('.change')
  @tooltipDone = @tooltip.querySelector('.done')
  @editor.renderer.addStyles(
    '#link-tooltip': {
      'background-color': '#fff'
      'border': '1px solid #000'
      'left': '-10000px'
      'padding': '5px 10px'
      'position': 'absolute'
      'white-space': 'nowrap'
    }
    '#link-tooltip a': {
      'cursor': 'pointer'
      'text-decoration': 'none'
    }
    '#link-tooltip .input'          : { 'display': 'none' }
    '#link-tooltip .done'           : { 'display': 'none' }
    '#link-tooltip.editing .input'  : { 'display': 'inline' }
    '#link-tooltip.editing .done'   : { 'display': 'inline' }
    '#link-tooltip.editing .url'    : { 'display': 'none' }
    '#link-tooltip.editing .change' : { 'display': 'none' }
  )
  @editor.renderer.addContainer(@tooltip)

showTooptip = (target, offset, limit, subjectDist = 5) ->
  left = target.offsetLeft + offset.offsetLeft + target.offsetWidth/2 - @tooltip.offsetWidth/2
  left = Math.min(Math.max(offset.offsetLeft, left), limit.offsetWidth + offset.offsetLeft - @tooltip.offsetWidth)
  top = offset.offsetTop + target.offsetTop + target.offsetHeight + subjectDist
  if top > offset.offsetHeight - @tooltip.offsetHeight
    top = target.offsetTop + offset.offsetTop - @tooltip.offsetHeight - subjectDist
  @tooltip.style.left = left
  @tooltip.style.top = top


class Scribe.LinkTooltip
  constructor: (@button, @toolbar) ->
    @editor = @toolbar.editor
    initTooltip.call(this)
    initListeners.call(this)


module.exports = Scribe
