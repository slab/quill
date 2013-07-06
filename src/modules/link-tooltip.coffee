Scribe = require('../scribe')


hideTooltip = ->
  @tooltip.style.left = '-10000px'

initListeners = ->
  @editor.root.addEventListener('click', (event) =>
    if event.target?.tagName == 'A'
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
      @tooltipLink.href = @tooltipInput.value = range.getText()
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
    <a class="url" target="_blank" href="about:blank"></a>
    <input class="input" type="text">
    <span>&#45;</span>
    <a class="action">Change</a>'
  @tooltipLink = @tooltip.querySelector('.url')
  @tooltipInput = @tooltip.querySelector('.input')
  @tooltipAction = @tooltip.querySelector('.action')
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
    }
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
