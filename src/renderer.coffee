Scribe = require('./scribe')


class Scribe.Renderer
  @DEFAULTS:
    keepHTML: false

  @DEFAULT_STYLES:
    '.editor': {
      'bottom': '10px'
      'font-family': "'Helvetica', 'Arial', san-serif"
      'font-size': '13px'
      'left': '15px'
      'line-height': '15px'
      'outline': 'none'
      'position': 'absolute'
      'right': '15px'
      'tab-size': '4'
      'top': '10px'
      'white-space': 'pre-wrap'
    }
    'html' : { 'height': '100%' }
    'body' : { 'cursor': 'text', 'height': '100%', 'margin': '0px', 'padding': '0px'}
    '.line:last-child': { 'padding-bottom': '10px' }
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
    '.background-black'  : { 'background-color': 'black' }
    '.background-red'    : { 'background-color': 'red' }
    '.background-orange' : { 'background-color': 'orange' }
    '.background-yellow' : { 'background-color': 'yellow' }
    '.background-green'  : { 'background-color': 'green' }
    '.background-blue'   : { 'background-color': 'blue' }
    '.background-purple' : { 'background-color': 'purple' }
    '.color-white'       : { 'color': 'white' }
    '.color-red'         : { 'color': 'red' }
    '.color-orange'      : { 'color': 'orange' }
    '.color-yellow'      : { 'color': 'yellow' }
    '.color-green'       : { 'color': 'green' }
    '.color-blue'        : { 'color': 'blue' }
    '.color-purple'      : { 'color': 'purple' }
    '.family-monospace'  : { 'font-family': "'Courier New', monospace" }
    '.family-serif'      : { 'font-family': "'Times New Roman', serif" }
    '.size-huge'         : { 'font-size': '32px', 'line-height': '36px' }
    '.size-large'        : { 'font-size': '18px', 'line-height': '22px' }
    '.size-small'        : { 'font-size': '10px', 'line-height': '12px' }
    '.indent-1' : { 'margin-left': '2em' }
    '.indent-2' : { 'margin-left': '4em' }
    '.indent-3' : { 'margin-left': '6em' }
    '.indent-4' : { 'margin-left': '8em' }
    '.indent-5' : { 'margin-left': '10em' }
    '.indent-6' : { 'margin-left': '12em' }
    '.indent-7' : { 'margin-left': '14em' }
    '.indent-8' : { 'margin-left': '16em' }
    '.indent-9' : { 'margin-left': '18em' }

  @objToCss: (obj) ->
    return _.map(obj, (value, key) ->
      innerStr = _.map(value, (innerValue, innerKey) -> return "#{innerKey}: #{innerValue};" ).join(' ')
      return "#{key} { #{innerStr} }"
    ).join("\n")


  constructor: (@container, options) ->
    @options = _.extend(Scribe.Renderer.DEFAULTS, options)
    this.createFrame()

  addStyles: (styles) ->
    head = @root.ownerDocument.getElementsByTagName('head')[0]
    style = @root.ownerDocument.createElement('style')
    style.type = 'text/css'
    css = Scribe.Renderer.objToCss(styles)
    if style.styleSheet?
      style.styleSheet.cssText = css
    else
      style.appendChild(@root.ownerDocument.createTextNode(css))
    head.appendChild(style)

  createFrame: ->
    html = @container.innerHTML
    @container.innerHTML = ''
    @iframe = @container.ownerDocument.createElement('iframe')
    @iframe.frameborder = 0
    @iframe.src = 'javascript:;'
    @iframe.height = @iframe.width = '100%'
    @container.appendChild(@iframe)
    doc = @iframe.contentWindow.document
    styles = _.map(@options.styles, (value, key) ->
      obj = Scribe.Renderer.DEFAULT_STYLES[key] or {}
      return _.extend(obj, value)
    )
    styles = _.extend(Scribe.Renderer.DEFAULT_STYLES, styles)
    @root = doc.createElement('div')
    @root.classList.add('editor')
    doc.body.appendChild(@root)
    this.addStyles(styles)
    @root.innerHTML = html if @options.keepHTML


module.exports = Scribe
