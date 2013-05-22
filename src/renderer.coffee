Scribe = require('./scribe')


getStyleObject = (styleString) ->
  return {} unless styleString?
  return _.reduce(styleString.split(';').slice(0, -1), (styles, str) ->
    [name, value] = str.split(':')
    value = value.slice(1) if value[0] == ' '
    styles[name] = value
    return styles
  , {})

_getFormatFromClass = (classList) ->
  for css in classList
    parts = css.split('-')
    return [parts[0], parts.slice(1).join('-')] if parts.length > 1
  return false

_getFormatFromStyle = (styleString) ->
  styles = getStyleObject(styleString)
  return false unless _.keys(styles).length > 0
  for formatName, formatObjects of @formats
    for formatValue, formatStyles of formatObjects
      matches = _.all(formatStyles, (styleValue, styleName) ->
        styles[styleName] == styleValue
      )
      return [formatName, formatValue] if matches
  return false

_runWhenLoaded = (fn) ->
  return fn.call(this) if @iframe.contentWindow.document.readyState == 'complete'
  if @iframe.contentWindow.onload
    @iframe.contentWindow.onload = _.wrap(@iframe.contentWindow.onload, (wrapper) =>
      wrapper.call(this)
      fn.call(this)
    )
  else
    @iframe.contentWindow.onload = fn


class Scribe.Renderer
  @DEFAULTS:
    keepHTML: false
    id: 'editor'

  @DEFAULT_STYLES:
    'div.editor': {
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
    'div.line:last-child': { 'padding-bottom': '10px' }
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

  @PFORMATS:
    'background': (value) ->
      switch (value)
        when 'white'  return { 'backgroundColor': 'rgb(255, 255, 255)' }
        when 'red'    return { 'backgroundColor': 'rgb(255, 0, 0)' }
        when 'orange' return { 'backgroundColor': 'rgb(255, 165, 0)' }
        when 'yellow' return { 'backgroundColor': 'rgb(255, 255, 0)' }
        when 'green'  return { 'backgroundColor': 'rgb(0, 128, 0)' }
        when 'blue'   return { 'backgroundColor': 'rgb(0, 0, 255)' }
        when 'purple' return { 'backgroundColor': 'rgb(128, 0, 128)' }
        else return false
    'color': (value) ->
      switch (value)
        when 'black'  return { 'color': 'rgb(0, 0, 0)' }
        when 'red'    return { 'color': 'rgb(255, 0, 0)' }
        when 'orange' return { 'color': 'rgb(255, 165, 0)' }
        when 'yellow' return { 'color': 'rgb(255, 255, 0)' }
        when 'green'  return { 'color': 'rgb(0, 128, 0)' }
        when 'blue'   return { 'color': 'rgb(0, 0, 255)' }
        when 'purple' return { 'color': 'rgb(128, 0, 128)' }
        else return false
    'family': (value) ->
      if value.indexOf('monospace') >= 0
        return { 'fontFamily': "'Courier New', monospace" }
      else if value.indexOf('serif') >= 0
        return { 'fontFamily': "'Times New Roman', serif" }
      else
        return false
    'size': (value) ->
      if value.
      'huge'   : { 'fontSize': '32px', 'lineHeight': '36px' }
      'large'  : { 'fontSize': '18px', 'lineHeight': '22px' }
      'small'  : { 'fontSize': '10px', 'lineHeight': '12px' }

  @objToCss: (obj) ->
    return _.map(obj, (value, key) ->
      innerStr = _.map(value, (innerValue, innerKey) -> return "#{innerKey}: #{innerValue};" ).join(' ')
      return "#{key} { #{innerStr} }"
    ).join("\n")


  constructor: (@container, options) ->
    @options = _.extend(Scribe.Renderer.DEFAULTS, options)
    @formats = {}
    this.createFrame()

  addContainer: (container, before = false) ->
    _runWhenLoaded.call(this, =>
      refNode = if before then @root else null
      @root.parentNode.insertBefore(container, refNode)
    )

  addFormat: (name, formats) ->
    @formats[name] ?= {}
    @formats[name] = _.extend(@formats[name], formats)

  addStyles: (styles) ->
    _runWhenLoaded.call(this, =>
      style = @root.ownerDocument.createElement('style')
      style.type = 'text/css'
      css = Scribe.Renderer.objToCss(styles)
      if style.styleSheet?
        style.styleSheet.cssText = css
      else
        style.appendChild(@root.ownerDocument.createTextNode(css))
      @root.ownerDocument.head.appendChild(style)
    )

  createFormatContainer: (name, value) ->
    switch (name)
      when 'bold'       then return @root.ownerDocument.createElement('b')
      when 'italic'     then return @root.ownerDocument.createElement('i')
      when 'strike'     then return @root.ownerDocument.createElement('s')
      when 'underline'  then return @root.ownerDocument.createElement('u')
      when 'link'
        link = @root.ownerDocument.createElement('a')
        value = 'https://' + value unless value.match(/https?:\/\//)
        link.href = value
        link.href = 'about:blank' if (link.protocol != 'http:' && link.protocol != 'https:')
        link.title = link.href
        return link
      else
        span = @root.ownerDocument.createElement('span')
        if @formats[name]?[value]?
          _.each(@formats[name][value], (cssValue, cssName) ->
            span.style[cssName] = cssValue
          )
        else
          span.classList.add("#{name}-#{value}")
        return span

  createFrame: ->
    html = @container.innerHTML
    @container.innerHTML = ''
    @iframe = @container.ownerDocument.createElement('iframe')
    @iframe.frameborder = 0
    @iframe.height = @iframe.width = '100%'
    @container.appendChild(@iframe)
    window.test = @iframe
    doc = @iframe.contentWindow.document
    @root = doc.createElement('div')
    @root.classList.add('editor')
    @root.id = @options.id
    @root.innerHTML = html if @options.keepHTML
    styles = _.map(@options.styles, (value, key) ->
      obj = Scribe.Renderer.DEFAULT_STYLES[key] or {}
      return _.extend(obj, value)
    )
    styles = _.extend(Scribe.Renderer.DEFAULT_STYLES, styles)
    this.addStyles(styles)
    _runWhenLoaded.call(this, =>
      @iframe.contentWindow.document.body.appendChild(@root) # Firefox does not like doc.body
    )

  getFormat: (container) ->
    switch (container.tagName)
      when 'A'  then return ['link', container.getAttribute('href')]
      when 'B'  then return ['bold', true]
      when 'I'  then return ['italic', true]
      when 'S'  then return ['strike', true]
      when 'U'  then return ['underline', true]
      when 'SPAN'
        return _getFormatFromStyle.call(this, container.getAttribute('style')) or 
               _getFormatFromClass.call(this, container.classList) or 
               []
      else
        return []


module.exports = Scribe


Format =
  createContainer: (value) ->
  



