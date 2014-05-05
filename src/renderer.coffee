_          = require('lodash')
DOM        = require('./dom')
Utils      = require('./utils')
Normalizer = require('./normalizer')


DEFAULT_STYLES =
  'html': { 'height': '100%', 'width': '100%' }
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
  '.editor-container p'          : { 'margin': '0', 'padding': '0' }
  '.editor-container a'          : { 'text-decoration': 'underline' }
  '.editor-container b'          : { 'font-weight': 'bold' }
  '.editor-container i'          : { 'font-style': 'italic' }
  '.editor-container s'          : { 'text-decoration': 'line-through' }
  '.editor-container u'          : { 'text-decoration': 'underline' }
  '.editor-container blockquote' : { 'margin': '0 0 0 2em', 'padding': '0' }
  '.editor-container ol'         : { 'margin': '0 0 0 2em', 'padding': '0', 'list-style-type': 'decimal' }
  '.editor-container ul'         : { 'margin': '0 0 0 2em', 'padding': '0', 'list-style-type': 'disc' }

LIST_STYLES = ['decimal', 'lower-alpha', 'lower-roman']
rule = '.editor-container ol > li'
_.each([1..9], (i) ->
  rule += ' > ol'
  DEFAULT_STYLES[rule] = { 'list-style-type': LIST_STYLES[i%3] }
  rule += ' > li'
)
DEFAULT_STYLES[DOM.DEFAULT_BREAK_TAG] = { 'display': 'none' } if Utils.isIE(10)


class Renderer
  @objToCss: (obj) ->
    return _.map(obj, (value, key) ->
      innerStr = _.map(value, (innerValue, innerKey) ->
        return "#{innerKey}: #{innerValue};"
      ).join(' ')
      return "#{key} { #{innerStr} }"
    ).join("\n")

  @buildFrame: (container) ->
    iframe = container.ownerDocument.createElement('iframe')
    iframe.setAttribute('frameBorder', '0')
    iframe.setAttribute('height', '100%')
    iframe.setAttribute('width', '100%')
    iframe.setAttribute('title', 'Quill Rich Text Editor')
    iframe.setAttribute('role', 'presentation')
    container.appendChild(iframe)
    iframeDoc = iframe.contentWindow.document
    iframeDoc.open()
    iframeDoc.write('<!DOCTYPE html>')
    iframeDoc.close()
    root = iframeDoc.createElement('div')
    iframeDoc.body.appendChild(root)
    return [root, iframe]

  constructor: (@container, @emitter, @options = {}) ->
    @container.innerHTML = ''
    [@root, @iframe] = Renderer.buildFrame(@container)
    @root.id = @options.id
    DOM.addClass(@root, 'editor-container')
    DOM.addEventListener(@container, 'focus', =>
      @root.focus()
    )
    this.addStyles(DEFAULT_STYLES)
    # Ensure user specified styles are added after modules'
    _.defer(_.bind(this.addStyles, this, @options.styles)) if @options.styles?

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
      @emitter.emit(@emitter.constructor.events.RENDER_UPDATE, css) if @emitter?
    )


module.exports = Renderer
