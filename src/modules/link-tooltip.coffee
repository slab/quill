_   = require('lodash')
DOM = require('../dom')


enterEditMode = (url) ->
  url = normalizeUrl(url)
  DOM.addClass(@tooltip, 'editing')
  @tooltipInput.focus()
  @tooltipInput.value = url

exitEditMode = ->
  if @savedLink? or DOM.getText(@tooltipLink) != @tooltipInput.value
    url = normalizeUrl(@tooltipInput.value)
    @tooltipLink.href = url
    DOM.setText(@tooltipLink, url)
    if @savedLink?
      @savedLink.href = url
      @savedLink = null
    else
      formatLink.call(this, @tooltipInput.value)
  DOM.removeClass(@tooltip, 'editing')

formatLink = (value) ->
  @scribe.setSelection(@savedRange, { silent: true })
  @scribe.formatText(@savedRange, 'link', value, { source: 'user' })

hideTooltip = ->
  @tooltip.style.left = '-10000px'

initListeners = ->
  DOM.addEventListener(@editorContainer, 'mouseup', (event) =>
    link = event.target
    while link? and link.tagName != 'DIV' and link.tagName != 'BODY'
      if link.tagName == 'A'
        url = normalizeUrl(link.href)
        @tooltipLink.href = url
        DOM.setText(@tooltipLink, url)
        DOM.removeClass(@tooltip, 'editing')
        showTooltip.call(this, link.getBoundingClientRect())
        @savedLink = link
        return
      link = link.parentNode
    hideTooltip.call(this)
  )
  DOM.addEventListener(@tooltipChange, 'click', =>
    enterEditMode.call(this, DOM.getText(@tooltipLink))
  )
  DOM.addEventListener(@tooltipDone, 'click', =>
    exitEditMode.call(this)
  )
  DOM.addEventListener(@tooltipInput, 'keyup', (event) =>
    exitEditMode.call(this) if event.which == Keyboard.keys.ENTER
  )
  return unless @options.button?
  DOM.addEventListener(@options.button, 'click', =>
    @savedRange = @scribe.getSelection()
    return unless @savedRange? and !@savedRange.isCollapsed()
    if DOM.hasClass(@options.button, 'active')
      formatLink.call(this, false)
      hideTooltip.call(this)
    else
      url = normalizeUrl(@savedRange.getText())
      if /\w+\.\w+/.test(url)
        @scribe.focus()
        formatLink.call(this, url)
      else
        DOM.addClass(@tooltip, 'editing')
        showTooltip.call(this, @scribe.editor.selection.getDimensions())
        enterEditMode.call(this, url)
  )

initTooltip = ->
  @tooltip = @scribe.addContainer('link-tooltip-container')
  hideTooltip.call(this)
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
  @scribe.addStyles(
    '.link-tooltip-container': {
      'background-color': '#fff'
      'border': '1px solid #000'
      'height': '23px'
      'padding': '5px 10px'
      'position': 'absolute'
      'white-space': 'nowrap'
    }
    '.link-tooltip-container a': {
      'cursor': 'pointer'
      'text-decoration': 'none'
    }
    '.link-tooltip-container > a, .link-tooltip-container > span': {
      'display': 'inline-block'
      'line-height': '23px'
    }
    '.link-tooltip-container .input'          : { 'display': 'none', 'width': '170px' }
    '.link-tooltip-container .done'           : { 'display': 'none' }
    '.link-tooltip-container.editing .input'  : { 'display': 'inline-block' }
    '.link-tooltip-container.editing .done'   : { 'display': 'inline-block' }
    '.link-tooltip-container.editing .url'    : { 'display': 'none' }
    '.link-tooltip-container.editing .change' : { 'display': 'none' }
  )

normalizeUrl = (url) ->
  url = 'http://' + url unless /^https?:\/\//.test(url)
  url = url.slice(0, url.length - 1) if url.slice(url.length - 1) == '/' # Remove trailing slash to standardize between browsers
  return url

showTooltip = (target, subjectDist = 5) ->
  tooltip = @tooltip.getBoundingClientRect()
  tooltipHeight = tooltip.bottom - tooltip.top
  tooltipWidth = tooltip.right - tooltip.left
  limit = @editorContainer.getBoundingClientRect()
  left = Math.max(limit.left, target.left + (target.right-target.left)/2 - tooltipWidth/2)
  if left + tooltipWidth > limit.right and limit.right - tooltipWidth > limit.left
    left = limit.right - tooltipWidth
  top = target.bottom + subjectDist
  if top + tooltipHeight > limit.bottom and target.top - tooltipHeight - subjectDist > limit.top
    top = target.top - tooltipHeight - subjectDist
  @tooltip.style.left = left + 'px'
  @tooltip.style.top = (top + (@tooltip.offsetTop-tooltip.top)) + 'px'


class LinkTooltip
  DEFAULTS:
    button: null

  constructor: (@scribe, @editorContainer, @options) ->
    initTooltip.call(this)
    initListeners.call(this)


module.exports = LinkTooltip
