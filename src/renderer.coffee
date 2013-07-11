Scribe = require('./scribe')


class Scribe.Renderer
  @DEFAULTS:
    id: 'editor'
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
      'div.editor': {
        'bottom': '10px'
        'left': '15px'
        'outline': 'none'
        'position': 'absolute'
        'right': '15px'
        'tab-size': '4'
        'top': '10px'
        'white-space': 'pre-wrap'
      }
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


  @objToCss: (obj) ->
    return _.map(obj, (value, key) ->
      innerStr = _.map(value, (innerValue, innerKey) -> return "#{innerKey}: #{innerValue};" ).join(' ')
      return "#{key} { #{innerStr} }"
    ).join("\n")


  constructor: (@container, options = {}) ->
    @options = _.defaults(options, Scribe.Renderer.DEFAULTS)
    this.createFrame()
    @formats = {}
    this.addStyles(Scribe.Renderer.DEFAULTS.styles)
    # Ensure user specified styles are added last
    this.runWhenLoaded( =>
      this.addStyles(options.styles) if options.styles?
    , -10)

  addContainer: (container, before = false) ->
    this.runWhenLoaded( =>
      refNode = if before then @root else null
      @root.parentNode.insertBefore(container, refNode)
    )

  addStyles: (styles) ->
    this.runWhenLoaded( =>
      style = @root.ownerDocument.createElement('style')
      style.type = 'text/css'
      css = Scribe.Renderer.objToCss(styles)
      if style.styleSheet?
        style.styleSheet.cssText = css
      else
        style.appendChild(@root.ownerDocument.createTextNode(css))
      # Firefox needs defer
      _.defer( =>
        @root.ownerDocument.head.appendChild(style)
      )
    )

  createFrame: ->
    html = @container.innerHTML
    @container.innerHTML = ''
    @iframe = @container.ownerDocument.createElement('iframe')
    @iframe.frameborder = 0
    @iframe.height = @iframe.width = '100%'
    @container.appendChild(@iframe)
    @root = this.getDocument().createElement('div')
    Scribe.DOM.addClass(@root, 'editor')
    @root.id = @options.id
    @root.innerHTML = Scribe.Normalizer.normalizeHtml(html) if @options.keepHTML
    this.runWhenLoaded( =>
      this.getDocument().body.appendChild(@root)
    )

  getDocument: ->
    # Firefox does not like us saving a reference to this result so retrieve every time
    # IE does not have contentWindow
    return @iframe.document or @iframe.contentWindow?.document

  runWhenLoaded: (fn, priority = 0) ->
    return fn.call(this) if this.getDocument()?.readyState == 'complete'
    if @callbacks?
      @callbacks[priority] ?= []
      @callbacks[priority].push(fn)
    else
      @callbacks = {}
      @callbacks[priority] = [fn]
      interval = setInterval( =>
        doc = this.getDocument()
        if doc?.readyState == 'complete'
          clearInterval(interval)
          _.defer( =>
            keys = _.keys(@callback).sort((a,b) -> b - a)
            _.each(keys, (key) ->
              _.each(@callbacks[key], (callback) =>
                callback.call(this)
              )
            )
            @callbacks = {}
          )
        else if !doc
          clearInterval(interval)
      , 100)


module.exports = Scribe
