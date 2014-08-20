_             = require('lodash')
pkg           = require('../package.json')
EventEmitter2 = require('eventemitter2').EventEmitter2
dom           = require('./lib/dom')
Editor        = require('./core/editor')
Format        = require('./core/format')
Range         = require('./lib/range')
Tandem        = require('tandem-core')


class Quill extends EventEmitter2
  @version: pkg.version
  @editors: []

  @modules: []
  @themes: []

  @DEFAULTS:
    formats: ['align', 'bold', 'italic', 'strike', 'underline', 'color', 'background', 'font', 'size', 'link', 'image', 'bullet', 'list']
    modules:
      'keyboard': true
      'paste-manager': true
      'undo-manager': true
    pollInterval: 100
    readOnly: false
    theme: 'default'

  @events:
    MODULE_INIT      : 'module-init'
    POST_EVENT       : 'post-event'
    PRE_EVENT        : 'pre-event'
    SELECTION_CHANGE : 'selection-change'
    TEXT_CHANGE      : 'text-change'

  @sources:
    API    : 'api'
    SILENT : 'silent'
    USER   : 'user'


  @registerModule: (name, module) ->
    console.warn("Overwriting #{name} module") if Quill.modules[name]?
    Quill.modules[name] = module

  @registerTheme: (name, theme) ->
    console.warn("Overwriting #{name} theme") if Quill.themes[name]?
    Quill.themes[name] = theme

  @require: (name) ->
    switch name
      when 'lodash' then return _
      when 'dom' then return dom
      when 'tandem-core' then return Tandem
      else return null


  constructor: (container, options = {}) ->
    container = document.querySelector(container) if _.isString(container)
    throw new Error('Invalid Quill container') unless container?
    moduleOptions = _.defaults(options.modules or {}, Quill.DEFAULTS.modules)
    html = container.innerHTML
    @options = _.defaults(options, Quill.DEFAULTS)
    @options.modules = moduleOptions
    @options.id = @id = "quill-#{Quill.editors.length + 1}"
    @options.emitter = this
    @modules = {}
    @editor = new Editor(container, this, @options)
    @root = @editor.doc.root
    Quill.editors.push(this)
    this.setHTML(html, Quill.sources.SILENT)
    themeClass = Quill.themes[@options.theme]
    throw new Error("Cannot load #{@options.theme} theme. Are you sure you registered it?") unless themeClass?
    @theme = new themeClass(this, @options)
    _.each(@options.modules, (option, name) =>
      this.addModule(name, option)
    )

  addContainer: (className, before = false) ->
    @editor.renderer.addContainer(className, before)

  addFormat: (name, format) ->
    @editor.doc.addFormat(name, format)

  addModule: (name, options) ->
    moduleClass = Quill.modules[name]
    throw new Error("Cannot load #{name} module. Are you sure you registered it?") unless moduleClass?
    options = {} unless _.isObject(options)  # Allow for addModule('module', true)
    options = _.defaults(options, @theme.constructor.OPTIONS[name] or {}, moduleClass.DEFAULTS or {})
    @modules[name] = new moduleClass(this, options)
    this.emit(Quill.events.MODULE_INIT, name, @modules[name])
    return @modules[name]

  addStyles: (styles) ->
    @editor.renderer.addStyles(styles)

  deleteText: (start, end, source = Quill.sources.API) ->
    [start, end, formats, source] = this._buildParams(start, end, {}, source)
    return unless end > start
    delta = Tandem.Delta.makeDeleteDelta(this.getLength(), start, end - start)
    @editor.applyDelta(delta, source)

  emit: (eventName, args...) ->
    super(Quill.events.PRE_EVENT, eventName, args...)
    super(eventName, args...)
    super(Quill.events.POST_EVENT, eventName, args...)

  focus: ->
    @editor.focus()

  formatLine: (start, end, name, value, source) ->
    [start, end, formats, source] = this._buildParams(start, end, name, value, source)
    [line, offset] = @editor.doc.findLineAt(end)
    end += (line.length - offset) if line?
    this.formatText(start, end, formats, source)

  formatText: (start, end, name, value, source) ->
    [start, end, formats, source] = this._buildParams(start, end, name, value, source)
    formats = _.reduce(formats, (formats, value, name) =>
      format = @editor.doc.formats[name]
      # TODO warn if no format
      formats[name] = null unless value and value != format.config.default     # false will be composed and kept in attributes
      return formats
    , formats)
    delta = Tandem.Delta.makeRetainDelta(this.getLength(), start, end - start, formats)
    @editor.applyDelta(delta, source)

  getContents: (start = 0, end = null) ->
    if _.isObject(start)
      end = start.end
      start = start.start
    else
      end = this.getLength() unless end?
    ops = @editor.getDelta().getOpsAt(start, end - start)
    return new Tandem.Delta(0, ops)

  getHTML: ->
    return @root.innerHTML

  getLength: ->
    return @editor.getDelta().endLength

  getModule: (name) ->
    return @modules[name]

  getSelection: ->
    @editor.checkUpdate()   # Make sure we access getRange with editor in consistent state
    return @editor.selection.getRange()

  getText: (start = 0, end = null) ->
    return _.pluck(this.getContents(start, end).ops, 'value').join('')

  insertEmbed: (index, type, url, source) ->
    this.insertText(index, dom.EMBED_TEXT, type, url, source)

  insertText: (index, text, name, value, source) ->
    [index, end, formats, source] = this._buildParams(index, 0, name, value, source)
    return unless text.length > 0
    delta = Tandem.Delta.makeInsertDelta(this.getLength(), index, text, formats)
    @editor.applyDelta(delta, source)

  onModuleLoad: (name, callback) ->
    if (@modules[name]) then return callback(@modules[name])
    this.on(Quill.events.MODULE_INIT, (moduleName, module) ->
      callback(module) if moduleName == name
    )

  prepareFormat: (name, value) ->
    format = @editor.doc.formats[name]
    return unless format?     # TODO warn
    range = this.getSelection()
    return unless range?.isCollapsed()
    if format.isType(Format.types.LINE)
      this.formatLine(range, name, value, Quill.sources.USER)
    else
      format.prepare(value)

  setContents: (delta, source = Quill.sources.API) ->
    if _.isArray(delta)
      delta =
        startLength: this.getLength()
        ops: delta
    else
      delta.startLength = this.getLength()
    this.updateContents(delta, source)

  setHTML: (html, source = Quill.sources.API) ->
    html = "<#{dom.DEFAULT_BLOCK_TAG}><#{dom.DEFAULT_BREAK_TAG}></#{dom.DEFAULT_BLOCK_TAG}>" unless html
    @editor.doc.setHTML(html)
    @editor.checkUpdate(source)

  setSelection: (start, end, source = Quill.sources.API) ->
    if _.isNumber(start) and _.isNumber(end)
      range = new Range(start, end)
    else
      range = start
      source = end or source
    @editor.selection.setRange(range, source)

  updateContents: (delta, source = Quill.sources.API) ->
    delta = Tandem.Delta.makeDelta(delta)
    @editor.applyDelta(delta, source)

  # fn(Number start, Number end, String name, String value, String source)
  # fn(Number start, Number end, Object formats, String source)
  # fn(Object range, String name, String value, String source)
  # fn(Object range, Object formats, String source)
  _buildParams: (params...) ->
    if _.isObject(params[0])
      params.splice(0, 1, params[0].start, params[0].end)
    if _.isString(params[2])
      formats = {}
      formats[params[2]] = params[3]
      params.splice(2, 2, formats)
    params[3] ?= Quill.sources.API
    return params


Quill.registerTheme('default', require('./themes/default'))
Quill.registerTheme('snow',    require('./themes/snow'))


module.exports = Quill
