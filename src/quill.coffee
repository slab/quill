_             = require('lodash')
pkg           = require('../package.json')
Delta         = require('rich-text/lib/delta')
EventEmitter2 = require('eventemitter2').EventEmitter2
dom           = require('./lib/dom')
Document      = require('./core/document')
Editor        = require('./core/editor')
Format        = require('./core/format')
Normalizer    = require('./core/normalizer')
Range         = require('./lib/range')


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
    styles: {}
    theme: 'base'

  @events:
    FORMAT_INIT      : 'format-init'
    MODULE_INIT      : 'module-init'
    POST_EVENT       : 'post-event'
    PRE_EVENT        : 'pre-event'
    SELECTION_CHANGE : 'selection-change'
    TEXT_CHANGE      : 'text-change'

  @sources: Editor.sources

  @registerModule: (name, module) ->
    console.warn("Overwriting #{name} module") if Quill.modules[name]?
    Quill.modules[name] = module

  @registerTheme: (name, theme) ->
    console.warn("Overwriting #{name} theme") if Quill.themes[name]?
    Quill.themes[name] = theme

  @require: (name) ->
    switch name
      when 'lodash'     then return _
      when 'delta'      then return Delta
      when 'format'     then return Format
      when 'normalizer' then return Normalizer
      when 'dom'        then return dom
      when 'document'   then return Document
      when 'range'      then return Range
      else return null


  constructor: (@container, options = {}) ->
    @container = document.querySelector(@container) if _.isString(@container)
    throw new Error('Invalid Quill container') unless @container?
    moduleOptions = _.defaults(options.modules or {}, Quill.DEFAULTS.modules)
    html = @container.innerHTML
    @container.innerHTML = ''
    @options = _.defaults(options, Quill.DEFAULTS)
    @options.modules = moduleOptions
    @options.id = @id = "ql-editor-#{Quill.editors.length + 1}"
    @modules = {}
    @root = this.addContainer('ql-editor')
    @editor = new Editor(@root, this, @options)
    Quill.editors.push(this)
    this.setHTML(html, Quill.sources.SILENT)
    themeClass = Quill.themes[@options.theme]
    throw new Error("Cannot load #{@options.theme} theme. Are you sure you registered it?") unless themeClass?
    @theme = new themeClass(this, @options)
    _.each(@options.modules, (option, name) =>
      this.addModule(name, option)
    )

  destroy: ->
    html = this.getHTML()
    _.each(@modules, (module, name) ->
      module.destroy() if _.isFunction(module.destroy)
    )
    @editor.destroy()
    this.removeAllListeners()
    Quill.editors.splice(_.indexOf(Quill.editors, this), 1)
    @container.innerHTML = html

  addContainer: (className, before = false) ->
    refNode = if before then @root else null
    container = document.createElement('div')
    dom(container).addClass(className)
    @container.insertBefore(container, refNode)
    return container

  addFormat: (name, config) ->
    @editor.doc.addFormat(name, config)
    this.emit(Quill.events.FORMAT_INIT, name)

  addModule: (name, options) ->
    moduleClass = Quill.modules[name]
    throw new Error("Cannot load #{name} module. Are you sure you registered it?") unless moduleClass?
    options = {} if options == true   # Allow for addModule('module', true)
    options = _.defaults(options, @theme.constructor.OPTIONS[name] or {}, moduleClass.DEFAULTS or {})
    @modules[name] = new moduleClass(this, options)
    this.emit(Quill.events.MODULE_INIT, name, @modules[name])
    return @modules[name]

  deleteText: (start, end, source = Quill.sources.API) ->
    [start, end, formats, source] = this._buildParams(start, end, {}, source)
    return unless end > start
    delta = new Delta().retain(start).delete(end - start)
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
    delta = new Delta().retain(start).retain(end - start, formats)
    @editor.applyDelta(delta, source)

  getBounds: (index) ->
    return @editor.getBounds(index)

  getContents: (start = 0, end = null) ->
    if _.isObject(start)
      end = start.end
      start = start.start
    return @editor.delta.slice(start, end)

  getHTML: ->
    @editor.doc.getHTML()

  getLength: ->
    return @editor.length

  getModule: (name) ->
    return @modules[name]

  getSelection: ->
    @editor.checkUpdate()   # Make sure we access getRange with editor in consistent state
    return @editor.selection.getRange()

  getText: (start = 0, end = null) ->
    return _.map(this.getContents(start, end).ops, (op) ->
      return if _.isString(op.insert) then op.insert else ''
    ).join('')

  getActiveFormats: (start = null, end = null) ->
    if start is null
      start = this.getSelection()

    if _.isObject(start)
      end = start.end
      start = start.start

    leafFormats = this._getLeafFormats(start, end)
    lineFormats = this._getLineFormats(start, end)
    return _.defaults({}, leafFormats, lineFormats)

  insertEmbed: (index, type, url, source) ->
    [index, end, formats, source] = this._buildParams(index, 0, type, url, source)
    delta = new Delta().retain(index).insert(1, formats)
    @editor.applyDelta(delta, source)

  insertText: (index, text, name, value, source) ->
    [index, end, formats, source] = this._buildParams(index, 0, name, value, source)
    return unless text.length > 0
    delta = new Delta().retain(index).insert(text, formats)
    @editor.applyDelta(delta, source)

  onModuleLoad: (name, callback) ->
    if (@modules[name]) then return callback(@modules[name])
    this.on(Quill.events.MODULE_INIT, (moduleName, module) ->
      callback(module) if moduleName == name
    )

  prepareFormat: (name, value, source = Quill.sources.API) ->
    format = @editor.doc.formats[name]
    return unless format?     # TODO warn
    range = this.getSelection()
    return unless range?.isCollapsed()
    if format.isType(Format.types.LINE)
      this.formatLine(range, name, value, source)
    else
      format.prepare(value)

  setContents: (delta, source = Quill.sources.API) ->
    if Array.isArray(delta)
      delta = new Delta(delta.slice())
    else
      delta = new Delta(delta.ops.slice())
    # Retain trailing newline unless inserting one
    lastOp = _.last(delta.slice(delta.length() - 1).ops)
    delta.delete(this.getLength() - 1)
    if lastOp? and _.isString(lastOp.insert) and _.last(lastOp.insert) == '\n'
      delta.delete(1)
    this.updateContents(delta, source)

  setHTML: (html, source = Quill.sources.API) ->
    html = "<#{dom.DEFAULT_BLOCK_TAG}><#{dom.DEFAULT_BREAK_TAG}></#{dom.DEFAULT_BLOCK_TAG}>" unless html.trim()
    @editor.doc.setHTML(html)
    @editor.checkUpdate(source)

  setSelection: (start, end, source = Quill.sources.API) ->
    if _.isNumber(start) and _.isNumber(end)
      range = new Range(start, end)
    else
      range = start
      source = end or source
    @editor.selection.setRange(range, source)

  setText: (text, source = Quill.sources.API) ->
    delta = new Delta().insert(text)
    this.setContents(delta, source)

  updateContents: (delta, source = Quill.sources.API) ->
    delta = { ops: delta } if Array.isArray(delta)
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

  _getLeafFormats: (start, end) ->
    if start == end
      [line, offset] = @editor.doc.findLineAt(start)
      if offset == 0
        contents = this.getContents(start, end + 1)
      else
        contents = this.getContents(start - 1, end)
    else
      contents = this.getContents(start, end)
    formats = _.map(contents.ops, 'attributes')
    return this._intersectFormats(formats)

  _getLineFormats: (start, end) ->
    formats = []
    [firstLine, offset] = @editor.doc.findLineAt(start)
    [lastLine, offset] = @editor.doc.findLineAt(end)
    currLine = firstLine
    while true
      formats.push(_.clone(currLine.formats))
      break if currLine == lastLine
      currLine = currLine.next
    return this._intersectFormats(formats)

  _intersectFormats: (formatGroups) ->
    return _.reduce(formatGroups.slice(1), (inAll, formats) ->
      _.omit(inAll, (value, name) ->
        return !formats? or !formats[name]? or formats[name] != value
      )
    , formatGroups[0] or {})


Quill.registerTheme('base', require('./themes/base'))
Quill.registerTheme('snow', require('./themes/snow'))


module.exports = Quill
