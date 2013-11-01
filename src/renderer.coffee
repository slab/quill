ScribeDOM         = require('./dom')
ScribeUtils       = require('./utils')
ScribeNormalizer  = require('./normalizer')


class ScribeRenderer extends EventEmitter2
  @DEFAULTS:
    id: 'editor'
    iframe: true
    keepHTML: false
    styles:
      'html' : { 'height': '100%' }
      'body': {
        'cursor': 'text'
        'font-family': "'Helvetica', 'Arial', sans-serif"
        'font-size': '13px'
        'height': '100%'
        'line-height': '1.154'
        'margin': '0px'
        'padding': '0px'
      }
      '.editor-container': {
        'overflow': 'auto'
        'position': 'relative'
      }
      'div.editor': {
        'bottom': '10px'
        'left': '0px'
        'outline': 'none'
        'position': 'absolute'
        'right': '0px'
        'tab-size': '4'
        'top': '10px'
        'white-space': 'pre-wrap'
      }
      'div.line': { 'margin-left': '15px', 'margin-right': '15px' }
      'a'    : { 'text-decoration': 'underline' }
      'b'    : { 'font-weight': 'bold' }
      'i'    : { 'font-style': 'italic' }
      's'    : { 'text-decoration': 'line-through' }
      'u'    : { 'text-decoration': 'underline' }
      'ol'   : { 'margin': '0px', 'padding': '0px' }
      'ul'   : { 'list-style-type': 'disc', 'margin': '0px', 'padding': '0px' }
      'ol.indent-1' : { 'list-style-type': 'decimal' }
      'ol.indent-2' : { 'list-style-type': 'lower-alpha' }
      'ol.indent-3' : { 'list-style-type': 'lower-roman' }
      'ol.indent-4' : { 'list-style-type': 'decimal' }
      'ol.indent-5' : { 'list-style-type': 'lower-alpha' }
      'ol.indent-6' : { 'list-style-type': 'lower-roman' }
      'ol.indent-7' : { 'list-style-type': 'decimal' }
      'ol.indent-8' : { 'list-style-type': 'lower-alpha' }
      'ol.indent-9' : { 'list-style-type': 'lower-roman' }
      '.indent-1' : { 'margin-left': '2em' }
      '.indent-2' : { 'margin-left': '4em' }
      '.indent-3' : { 'margin-left': '6em' }
      '.indent-4' : { 'margin-left': '8em' }
      '.indent-5' : { 'margin-left': '10em' }
      '.indent-6' : { 'margin-left': '12em' }
      '.indent-7' : { 'margin-left': '14em' }
      '.indent-8' : { 'margin-left': '16em' }
      '.indent-9' : { 'margin-left': '18em' }

  @events:
    UPDATE: 'renderer-update'


  @objToCss: (obj) ->
    return _.map(obj, (value, key) ->
      innerStr = _.map(value, (innerValue, innerKey) -> return "#{innerKey}: #{innerValue};" ).join(' ')
      return "#{key} { #{innerStr} }"
    ).join("\n")


  constructor: (@container, options = {}) ->
    options = options.renderer or {}
    originalStyles = options.styles
    @options = _.defaults(options, ScribeRenderer.DEFAULTS)
    @options.styles = originalStyles
    this.buildFrame()
    @formats = {}
    # IE10 ignores conditional comments and it still displays <div><br></div> as two lines
    ScribeRenderer.DEFAULTS.styles['br'] = { 'display': 'none' } if ScribeUtils.isIE()
    this.addStyles(ScribeRenderer.DEFAULTS.styles)
    # Ensure user specified styles are added last
    _.defer( =>
      this.addStyles(options.styles) if options.styles?
    )

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
    ScribeDOM.addClass(@container, 'editor-container')
    @container.innerHTML = ''
    if @options.iframe
      @iframe = @container.ownerDocument.createElement('iframe')
      @iframe.frameBorder = '0'
      @iframe.height = @iframe.width = '100%'
      @container.appendChild(@iframe)
      doc = this.getDocument()
      doc.open()
      doc.write('<!DOCTYPE html>')
      doc.close()
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
    @root.innerHTML = ScribeNormalizer.normalizeHtml(html) if @options.keepHTML
    ScribeDOM.addEventListener(@container, 'focus', =>
      @root.focus()
    )

  getDocument: ->
    return null unless @iframe.parentNode?
    # Firefox does not like us saving a reference to this result so retrieve every time
    if @options.iframe
      return @iframe.contentWindow?.document
    else
      return @iframe.ownerDocument


module.exports = ScribeRenderer
