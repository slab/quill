_                 = require('lodash')
EventEmitter2     = require('eventemitter2').EventEmitter2
ScribeDOM         = require('./dom')
ScribeUtils       = require('./utils')
ScribeNormalizer  = require('./normalizer')

DEFAULT_STYLES =
  '.editor-container':
    'cursor'      : 'text'
    'font-family' : "'Helvetica', 'Arial', sans-serif"
    'font-size'   : '13px'
    'height'      : '100%'
    'line-height' : '1.42'
    'margin'      : '0px'
    'overflow-x'  : 'hidden'
    'overflow-y'  : 'auto'
    'padding'     : '0px'
  '.editor':
    'height'      : '100%'
    'outline'     : 'none'
    'tab-size'    : '4'
    'white-space' : 'pre-wrap'
  '.editor .line:first-child' : { 'padding-top': '12px' }
  '.editor .line:last-child'  : { 'padding-bottom': '12px' }
  '.editor .line': { 'margin-left': '15px', 'margin-right': '15px' }
  '.editor a'    : { 'text-decoration': 'underline' }
  '.editor b'    : { 'font-weight': 'bold' }
  '.editor i'    : { 'font-style': 'italic' }
  '.editor s'    : { 'text-decoration': 'line-through' }
  '.editor u'    : { 'text-decoration': 'underline' }
  '.editor ol'   : { 'margin': '0px', 'padding': '0px' }
  '.editor ul'   : { 'list-style-type': 'disc', 'margin': '0px', 'padding': '0px' }
  '.editor ol.indent-1' : { 'list-style-type': 'decimal' }
  '.editor ol.indent-2' : { 'list-style-type': 'lower-alpha' }
  '.editor ol.indent-3' : { 'list-style-type': 'lower-roman' }
  '.editor ol.indent-4' : { 'list-style-type': 'decimal' }
  '.editor ol.indent-5' : { 'list-style-type': 'lower-alpha' }
  '.editor ol.indent-6' : { 'list-style-type': 'lower-roman' }
  '.editor ol.indent-7' : { 'list-style-type': 'decimal' }
  '.editor ol.indent-8' : { 'list-style-type': 'lower-alpha' }
  '.editor ol.indent-9' : { 'list-style-type': 'lower-roman' }
  '.editor .indent-1' : { 'margin-left': '2em' }
  '.editor .indent-2' : { 'margin-left': '4em' }
  '.editor .indent-3' : { 'margin-left': '6em' }
  '.editor .indent-4' : { 'margin-left': '8em' }
  '.editor .indent-5' : { 'margin-left': '10em' }
  '.editor .indent-6' : { 'margin-left': '12em' }
  '.editor .indent-7' : { 'margin-left': '14em' }
  '.editor .indent-8' : { 'margin-left': '16em' }
  '.editor .indent-9' : { 'margin-left': '18em' }
DEFAULT_STYLES['br'] = { 'display': 'none' } if ScribeUtils.isIE()

class ScribeRenderer extends EventEmitter2
  @events:
    UPDATE: 'renderer-update'

  @objToCss: (obj) ->
    return _.map(obj, (value, key) ->
      innerStr = _.map(value, (innerValue, innerKey) -> return "#{innerKey}: #{innerValue};" ).join(' ')
      return "#{key} { #{innerStr} }"
    ).join("\n")


  constructor: (@container, @options = {}) ->
    this.buildFrame()
    this.addStyles(DEFAULT_STYLES)
    # Ensure user specified styles are added last
    _.defer(this.addStyles.bind(this, @options.styles)) if options.styles?

  addContainer: (container, before = false) ->
    refNode = if before then @root else null
    @root.parentNode.insertBefore(container, refNode)

  addStyles: (css) ->
    style = @root.ownerDocument.createElement('style')
    style.type = 'text/css'
    css = ScribeRenderer.objToCss(css) unless _.isString(css)
    if style.styleSheet?
      style.styleSheet.cssText = css
    else
      style.appendChild(@root.ownerDocument.createTextNode(css))
    # Firefox needs defer
    _.defer( =>
      @root.ownerDocument.querySelector('head').appendChild(style)
      this.emit(ScribeRenderer.events.UPDATE, css)
    )

  buildFrame: ->
    html = @container.innerHTML
    @container.innerHTML = ''
    if @options.iframe
      @iframe = @container.ownerDocument.createElement('iframe')
      @iframe.frameBorder = '0'
      @container.appendChild(@iframe)
      doc = this.getDocument()
      @iframe.height = @iframe.width = '100%'
      doc.open()
      doc.write('<!DOCTYPE html>')
      doc.close()
      htmlTag = doc.querySelector('html')
      htmlTag.style.height = doc.body.style.height = '100%'
    else
      @iframe = @container
      doc = this.getDocument()
    @root = doc.createElement('div')
    ScribeDOM.addClass(@root, 'editor')
    @root.id = @options.id
    if @options.iframe
      doc.body.appendChild(@root)
    else
      @container.appendChild(@root)
    ScribeDOM.addClass(@root.parentNode, 'editor-container')
    @root.innerHTML = ScribeNormalizer.normalizeHtml(html)
    ScribeDOM.addEventListener(@container, 'focus', =>
      @root.focus()
    )

  checkFocus: ->
    return @root.ownerDocument.activeElement == @root

  getDocument: ->
    return null unless @iframe.parentNode?
    # Firefox does not like us saving a reference to this result so retrieve every time
    if @options.iframe
      return @iframe.contentWindow?.document
    else
      return @iframe.ownerDocument


module.exports = ScribeRenderer
