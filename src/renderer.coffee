#= require underscore

class TandemRenderer
  @DEFAULTS:
    keepHTML: false

  @DEFAULT_STYLES:
    '.editor': {
      'font-family': "'Helvetica', 'Arial', san-serif"
      'font-size': '13px'
      'line-height': '15px'
      'min-height': '100%'
      'outline': 'none'
      'padding': '10px 15px'
      'tab-size': '4'
      'white-space': 'pre-wrap'
    }
    'body' : { 'margin': '0px', 'padding': '0px' }
    'a'    : { 'cursor': 'pointer', 'text-decoration': 'underline' }
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
    '.font-background.black'  : { 'background-color': 'black' }
    '.font-background.red'    : { 'background-color': 'red' }
    '.font-background.orange' : { 'background-color': 'orange' }
    '.font-background.yellow' : { 'background-color': 'yellow' }
    '.font-background.green'  : { 'background-color': 'green' }
    '.font-background.blue'   : { 'background-color': 'blue' }
    '.font-background.purple' : { 'background-color': 'purple' }
    '.font-color.white'       : { 'color': 'white' }
    '.font-color.red'         : { 'color': 'red' }
    '.font-color.orange'      : { 'color': 'orange' }
    '.font-color.yellow'      : { 'color': 'yellow' }
    '.font-color.green'       : { 'color': 'green' }
    '.font-color.blue'        : { 'color': 'blue' }
    '.font-color.purple'      : { 'color': 'purple' }
    '.font-family.monospace'  : { 'font-family': "'Courier New', monospace" }
    '.font-family.serif'      : { 'font-family': "'Times New Roman', serif" }
    '.font-size.huge'         : { 'font-size': '32px', 'line-height': '36px' }
    '.font-size.large'        : { 'font-size': '18px', 'line-height': '22px' }
    '.font-size.small'        : { 'font-size': '10px', 'line-height': '12px' }
    '.indent-1' : { 'margin-left': '2em' }
    '.indent-2' : { 'margin-left': '4em' }
    '.indent-3' : { 'margin-left': '6em' }
    '.indent-4' : { 'margin-left': '8em' }
    '.indent-5' : { 'margin-left': '10em' }
    '.indent-6' : { 'margin-left': '12em' }
    '.indent-7' : { 'margin-left': '14em' }
    '.indent-8' : { 'margin-left': '16em' }
    '.indent-9' : { 'margin-left': '18em' }
    '.tab' : { 'display': 'inline-block', 'margin': '0px' }
    '.cursor': { 'display': 'inline-block', 'height': '0px', 'width': '0px' }
    '.cursor-name': { 'color': 'white', 'display': 'inline-block', 'position': 'relative', 'padding': '2px 8px', 'left': '-1px', 'top': '-31px' }
    '.cursor-inner': { 'display': 'inline-block', 'width': '2px', 'position': 'relative', 'height': '15px', 'left': '-1px', 'top': '-31px' }
    '.author-0': { 'color': "#33cc33" }
    '.author-1': { 'color': "#0099ff" }
    '.author-2': { 'color': "#ff00ff" }
    '.author-3': { 'color': "#ff9933" }
    '.author-4': { 'color': "#00ff99" }
    '.author-5': { 'color': "#3366ff" }
    '.author-6': { 'color': "#ff3399" }
    '.author-7': { 'color': "#ffff00" }
    '.author-8': { 'color': "#33cccc" }
    '.author-9': { 'color': "#9966ff" }
    '.author-10': { 'color': "#ff5050" }
    '.author-11': { 'color': "#99ff33" }


  @objToCss: (obj) ->
    return _.map(obj, (value, key) ->
      innerStr = _.map(value, (innerValue, innerKey) -> return "#{innerKey}: #{innerValue};" ).join(' ')
      return "#{key} { #{innerStr} }"
    ).join("\n")


  constructor: (@container, options) ->
    @options = _.extend(Tandem.Renderer.DEFAULTS, options)
    this.createFrame()

  destroy: ->

  createFrame: ->
    html = @container.innerHTML
    @container.innerHTML = ''
    @iframe = @container.ownerDocument.createElement('iframe')
    @iframe.frameborder = 0
    @iframe.src = 'javascript:;'
    @iframe.height = @iframe.width = '100%'
    @container.appendChild(@iframe)
    doc = @iframe.contentWindow.document
    head = doc.getElementsByTagName('head')[0]
    style = doc.createElement('style')
    style.type = 'text/css'
    styles = _.map(@options.styles, (value, key) ->
      obj = Tandem.Renderer.DEFAULT_STYLES[key] or {}
      return _.extend(obj, value)
    )
    styles = _.extend(Tandem.Renderer.DEFAULT_STYLES, styles)
    css = Tandem.Renderer.objToCss(styles)
    if style.styleSheet?
      style.styleSheet.cssText = css
    else
      style.appendChild(doc.createTextNode(css))
    head.appendChild(style)
    contentContainer = doc.createElement('div')
    contentContainer.id = Tandem.Editor.CONTAINER_ID
    contentContainer.classList.add('editor')
    doc.body.appendChild(contentContainer)
    contentContainer.innerHTML = html if @options.keepHTML



window.Tandem ||= {}
window.Tandem.Renderer = TandemRenderer
