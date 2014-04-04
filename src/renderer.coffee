_          = require('lodash')
DOM        = require('./dom')
Utils      = require('./utils')
Normalizer = require('./normalizer')


DEFAULT_STYLES =
  'body':
    'box-sizing'  : 'border-box'
    'cursor'      : 'text'
    'font-family' : "'Helvetica', 'Arial', sans-serif"
    'font-size'   : '13px'
    'height'      : '100%'
    'line-height' : '1.42'
    'margin'      : '0px'
    'overflow-x'  : 'hidden'
    'overflow-y'  : 'auto'
    'padding'     : '12px 15px'
  '.editor-container':
    'height'      : '100%'
    'outline'     : 'none'
    'position'    : 'relative'
    'tab-size'    : '4'
    'white-space' : 'pre-wrap'
  '.editor-container a'    : { 'text-decoration': 'underline' }
  '.editor-container b'    : { 'font-weight': 'bold' }
  '.editor-container i'    : { 'font-style': 'italic' }
  '.editor-container s'    : { 'text-decoration': 'line-through' }
  '.editor-container u'    : { 'text-decoration': 'underline' }
  '.editor-container ol'   : { 'margin': '0px', 'padding': '0px' }
  '.editor-container ul'   : { 'list-style-type': 'disc', 'margin': '0px', 'padding': '0px' }

LIST_STYLES = ['decimal', 'lower-alpha', 'lower-roman']
_.each([1..9], (i) ->
  DEFAULT_STYLES[".editor-container .indent-#{i}"] = { 'margin-left': "#{2*i}em" }
  DEFAULT_STYLES[".editor-container ol.indent-#{i}"] = { 'list-style-type': LIST_STYLES[(i-1)%3] }
)
DEFAULT_STYLES['br'] = { 'display': 'none' } if Utils.isIE()


class Renderer
  @objToCss: (obj) ->
    return _.map(obj, (value, key) ->
      innerStr = _.map(value, (innerValue, innerKey) -> return "#{innerKey}: #{innerValue};" ).join(' ')
      return "#{key} { #{innerStr} }"
    ).join("\n")

  constructor: (@container, @emitter, @options = {}) ->
    this.buildFrame()
    this.addStyles(DEFAULT_STYLES)
    # Ensure user specified styles are added last
    _.defer(_.bind(this.addStyles, this, @options.styles)) if options.styles?

  addContainer: (className, before = false) ->
    refNode = if before then @root else null
    container = @root.ownerDocument.createElement('div')
    DOM.addClass(container, className)
    @root.parentNode.insertBefore(container, refNode)
    return container

  addStyles: (css) ->
    style = @root.ownerDocument.createElement('style')
    style.type = 'text/css'
    css = Renderer.objToCss(css) unless _.isString(css)
    if style.styleSheet?
      style.styleSheet.cssText = css
    else
      style.appendChild(@root.ownerDocument.createTextNode(css))
    # Firefox needs defer
    _.defer( =>
      @root.ownerDocument.querySelector('head').appendChild(style)
      @emitter.emit(@emitter.constructor.events.RENDER_UPDATE, css)
      DOM.addClass(@container, 'sc-container')
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
    DOM.addClass(@root, 'editor-container')
    @root.id = @options.id
    if @options.iframe
      doc.body.appendChild(@root)
    else
      @container.appendChild(@root)
    @root.innerHTML = Normalizer.normalizeHtml(html)
    DOM.addEventListener(@container, 'focus', =>
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


module.exports = Renderer
