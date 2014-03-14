_               = require('lodash')
ScribeDOM       = require('../dom')
ScribeKeyboard  = require('../keyboard')
ScribePosition  = require('../position')
ScribeRange     = require('../range')


enterEditMode = (url) ->
  url = normalizeUrl(url)
  ScribeDOM.addClass(@tooltip, 'editing')
  @tooltipInput.focus()
  @tooltipInput.value = url

exitEditMode = ->
  if @savedLink? or ScribeDOM.getText(@tooltipLink) != @tooltipInput.value
    url = normalizeUrl(@tooltipInput.value)
    @tooltipLink.href = url
    ScribeDOM.setText(@tooltipLink, url)
    if @savedLink?
      @savedLink.href = url
      @savedLink = null
    else
      formatLink.call(this, @tooltipInput.value)
  ScribeDOM.removeClass(@tooltip, 'editing')

formatLink = (value) ->
  @scribe.editor.setSelection(@savedRange, true)
  @savedRange.format('link', value, { source: 'user' })

hideTooltip = ->
  @tooltip.style.left = '-10000px'

initListeners = ->
  ScribeDOM.addEventListener(@editorContainer, 'mouseup', (event) =>
    link = event.target
    while link? and link.tagName != 'DIV' and link.tagName != 'BODY'
      if link.tagName == 'A'
        url = normalizeUrl(link.href)
        @tooltipLink.href = url
        ScribeDOM.setText(@tooltipLink, url)
        ScribeDOM.removeClass(@tooltip, 'editing')
        showTooltip.call(this, link.getBoundingClientRect())
        @savedLink = link
        return
      link = link.parentNode
    hideTooltip.call(this)
  )
  ScribeDOM.addEventListener(@options.button, 'click', =>
    @savedRange = @scribe.editor.getSelection()
    return unless @savedRange? and !@savedRange.isCollapsed()
    if ScribeDOM.hasClass(@options.button, 'active')
      formatLink.call(this, false)
      hideTooltip.call(this)
    else
      url = normalizeUrl(@savedRange.getText())
      if /\w+\.\w+/.test(url)
        @editorContainer.focus()
        formatLink.call(this, url)
      else
        ScribeDOM.addClass(@tooltip, 'editing')
        showTooltip.call(this, @scribe.editor.selection.getDimensions())
        enterEditMode.call(this, url)
  )
  ScribeDOM.addEventListener(@tooltipChange, 'click', =>
    enterEditMode.call(this, ScribeDOM.getText(@tooltipLink))
  )
  ScribeDOM.addEventListener(@tooltipDone, 'click', =>
    exitEditMode.call(this)
  )
  ScribeDOM.addEventListener(@tooltipInput, 'keyup', (event) =>
    exitEditMode.call(this) if event.which == ScribeKeyboard.keys.ENTER
  )

initTooltip = ->
  @tooltip = @options.button.ownerDocument.createElement('div')
  ScribeDOM.addClass(@tooltip, 'link-tooltip-container')
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
  hideTooltip.call(this)
  _.defer(@scribe.editor.renderer.addContainer.bind(@scribe.editor.renderer, @tooltip))

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


class ScribeLinkTooltip
  @DEFAULTS:
    button: null      # Required

  constructor: (@scribe, @editorContainer, @options) ->
    initTooltip.call(this)
    initListeners.call(this)
    @scribe.theme.onModuleLoad('toolbar', (toolbar) ->
      toolbar.initFormat('link', 'BUTTON')
    )


module.exports = ScribeLinkTooltip
