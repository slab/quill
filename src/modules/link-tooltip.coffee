Scribe = require('../scribe')


hideTooltip = ->
  @tooltip.style.left = '-10000px'

initListeners = ->
  @editor.root.addEventListener('click', (event) =>
    if event.target?.tagName == 'A'
      @tooltipLink.innerText = @tooltipLink.href = event.target.href
      showTooptip.call(this, event.target, @tooltip.offsetParent, @editor.root)
    else
      hideTooltip.call(this)
  )
  @button.addEventListener('click', =>
    value = null
    if Scribe.DOM.hasClass(@button, 'active')
      value = false
    else
      range = @editor.selection.getRange()
      text = range.getText()
      text = 'https://' + text unless /^http[s]?:\/\//.test(text)
      @tooltipInput.value = text
      Scribe.DOM.addClass(@tooltip, 'editing')
      showTooptip.call(this, @editor.selection.getDimensions(), @tooltip.offsetParent, @editor.root)
      @tooltipInput.focus()
    if value?
      @editor.selection.format(format, value, { source: 'user' })
      this.emit(Scribe.Toolbar.events.FORMAT, format, value)
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
  constructor: (@button, @editor) ->
    initTooltip.call(this)
    initListeners.call(this)


module.exports = Scribe
