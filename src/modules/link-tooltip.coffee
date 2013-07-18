Scribe = require('../scribe')


enterEditMode = (url) ->
  url = 'http://' + url unless /^http[s]?:\/\//.test(url)
  Scribe.DOM.addClass(@tooltip, 'editing')
  @tooltipInput.focus()
  @tooltipInput.value = url

exitEditMode = ->
  if @tooltipLink.innerText != @tooltipInput.value
    @editor.setSelection(@savedRange, true)
    @editor.selection.format('link', @tooltipInput.value, { source: 'user' })
    formats = @savedRange.getFormats()
    if formats['link']?
      @tooltipLink.href = formats['link']
      Scribe.DOM.setText(@tooltipLink, formats['link'])
      @toolbar.emit(Scribe.Toolbar.events.FORMAT, 'link', formats['link'])
    @editor.setSelection(null, true)
  Scribe.DOM.removeClass(@tooltip, 'editing')

hideTooltip = ->
  @tooltip.style.left = '-10000px'

initListeners = ->
  Scribe.DOM.addEventListener(@editor.root, 'mouseup', (event) =>
    link = event.target
    while link? and link.tagName != 'DIV' and link.tagName != 'BODY'
      if link.tagName == 'A'
        start = new Scribe.Position(@editor, link, 0)
        end = new Scribe.Position(@editor, link, Scribe.DOM.getText(link).length)
        @savedRange = new Scribe.Range(@editor, start, end)
        @tooltipLink.innerText = @tooltipLink.href = link.href
        Scribe.DOM.removeClass(@tooltip, 'editing')
        showTooptip.call(this, link.getBoundingClientRect())
        return
      link = link.parentNode
    hideTooltip.call(this)
  )
  Scribe.DOM.addEventListener(@button, 'click', =>
    value = null
    if Scribe.DOM.hasClass(@button, 'active')
      value = false
    else
      @savedRange = @editor.selection.getRange()
      url = @savedRange.getText()
      if /\w+\.\w+/.test(url)
        value = url
      else
        Scribe.DOM.addClass(@tooltip, 'editing')
        showTooptip.call(this, @editor.selection.getDimensions())
        enterEditMode.call(this, url)
    if value?
      range = @editor.selection.getRange()
      range.formatContents('link', value, { source: 'user' })
      @toolbar.emit(Scribe.Toolbar.events.FORMAT, 'link', value)
  )
  Scribe.DOM.addEventListener(@tooltipChange, 'click', =>
    enterEditMode.call(this, @tooltipLink.innerText)
  )
  Scribe.DOM.addEventListener(@tooltipDone, 'click', =>
    exitEditMode.call(this)
  )
  Scribe.DOM.addEventListener(@tooltipInput, 'keyup', (event) =>
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
      'height': '23px'
      'padding': '5px 10px'
      'position': 'absolute'
      'white-space': 'nowrap'
    }
    '#link-tooltip a': {
      'cursor': 'pointer'
      'text-decoration': 'none'
    }
    '#link-tooltip > a, #link-tooltip > span': {
      'display': 'inline-block'
      'line-height': '23px'
    }
    '#link-tooltip .input'          : { 'display': 'none', 'width': '170px' }
    '#link-tooltip .done'           : { 'display': 'none' }
    '#link-tooltip.editing .input'  : { 'display': 'inline-block' }
    '#link-tooltip.editing .done'   : { 'display': 'inline-block' }
    '#link-tooltip.editing .url'    : { 'display': 'none' }
    '#link-tooltip.editing .change' : { 'display': 'none' }
  )
  @editor.renderer.runWhenLoaded( =>
    @editor.renderer.addContainer(@tooltip)
  )
  
showTooptip = (target, subjectDist = 5) ->
  tooltip = @tooltip.getBoundingClientRect()
  tooltipHeight = tooltip.bottom - tooltip.top
  tooltipWidth = tooltip.right - tooltip.left
  limit = @editor.root.getBoundingClientRect()
  left = Math.max(limit.left, target.left + (target.right-target.left)/2 - tooltipWidth/2)
  if left + tooltipWidth > limit.right and limit.right - tooltipWidth > limit.left
    left = limit.right - tooltipWidth
  top = target.bottom + subjectDist
  if top + tooltipHeight > limit.bottom and target.top - tooltipHeight - subjectDist > limit.top
    top = target.top - tooltipHeight - subjectDist
  @tooltip.style.left = left
  @tooltip.style.top = top + (@tooltip.offsetTop-tooltip.top)


class Scribe.LinkTooltip
  constructor: (@button, @toolbar) ->
    @editor = @toolbar.editor
    initTooltip.call(this)
    initListeners.call(this)


module.exports = Scribe
