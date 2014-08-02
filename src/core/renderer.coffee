_          = require('lodash')
dom        = require('../lib/dom')
Normalizer = require('../lib/normalizer')


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
  '.editor-container div'        : { 'margin': '0', 'padding': '0' }
  '.editor-container a'          : { 'text-decoration': 'underline' }
  '.editor-container b'          : { 'font-weight': 'bold' }
  '.editor-container i'          : { 'font-style': 'italic' }
  '.editor-container s'          : { 'text-decoration': 'line-through' }
  '.editor-container u'          : { 'text-decoration': 'underline' }
  '.editor-container img'        : { 'max-width': '100%' }
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
DEFAULT_STYLES[dom.DEFAULT_BREAK_TAG] = { 'display': 'none' } if dom.isIE(10)


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
    dom(iframe).attributes(
      frameBorder: '0'
      height: '100%'
      width: '100%'
      title: 'Quill Rich Text Editor'
      role: 'presentation'
    )
    container.appendChild(iframe)
    iframeDoc = iframe.contentWindow.document
    iframeDoc.open()
    iframeDoc.write('<!DOCTYPE html>')
    iframeDoc.close()
    root = iframeDoc.createElement('div')
    iframeDoc.body.appendChild(root)
    return [root, iframe]

  constructor: (@container, @options = {}) ->
    @container.innerHTML = ''
    [@root, @iframe] = Renderer.buildFrame(@container)
    @root.setAttribute('id', @options.id)
    @iframe.setAttribute('name', @options.id)
    dom(@root).addClass('editor-container')
    dom(@container).addClass('ql-container')
    dom(@container).on('focus', =>
      @root.focus()
    )
    # Mobile Safari lets iframe content overflow
    if dom.isIOS()
      dom(@container).addStyles(
        'overflow': 'auto'
        '-webkit-overflow-scrolling': 'touch'
      )
    this.addStyles(DEFAULT_STYLES)
    # Ensure user specified styles are added after modules'
    _.defer(_.bind(this.addStyles, this, @options.styles)) if @options.styles?

  addContainer: (className, before = false) ->
    refNode = if before then @root else null
    container = @root.ownerDocument.createElement('div')
    dom(container).addClass(className)
    @root.parentNode.insertBefore(container, refNode)
    return container

  addStyles: (css) ->
    if typeof css == 'object'
      style = @root.ownerDocument.createElement('style')
      style.type = 'text/css'
      css = Renderer.objToCss(css)
      style.appendChild(@root.ownerDocument.createTextNode(css))
      @root.ownerDocument.head.appendChild(style)
    else if typeof css == 'string'
      link = @root.ownerDocument.createElement('link')
      dom(link).attributes(
        type: 'text/css'
        rel: 'stylesheet'
        href: css
      )
      @root.ownerDocument.head.appendChild(link)


module.exports = Renderer
