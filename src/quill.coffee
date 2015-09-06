pkg          = require('../package.json')
Delta        = require('rich-text/lib/delta')
EventEmitter = require('eventemitter3')
dom          = require('./lib/dom')
extend       = require('extend')
Editor       = require('./editor')
Parchment    = require('parchment')
Selection    = require('./selection')

Block    = require('./blots/block')
Break    = require('./blots/break')
Cursor   = require('./blots/cursor')

Formats =
  Inline  : require('./formats/inline')
  Block   : require('./formats/block')
  Image   : require('./formats/image')
  Header  : require('./formats/header')
  List    : require('./formats/list')


class Quill extends EventEmitter
  @version: pkg.version

  @modules: {}
  @themes: {}

  @DEFAULTS:
    formats: [
      'align', 'direction',
      'bullet', 'header', 'list',
      'bold', 'code', 'italic', 'script', 'strike', 'underline',
      'link',
      'background', 'color', 'font', 'size',
      'image'
    ]
    modules:
      'keyboard': true
      'paste-manager': true
      'undo-manager': true
    readOnly: false
    theme: 'base'

  @events:
    FORMAT_INIT      : 'format-init'
    MODULE_INIT      : 'module-init'
    POST_EVENT       : 'post-event'
    PRE_EVENT        : 'pre-event'
    SELECTION_CHANGE : 'selection-change'
    TEXT_CHANGE      : 'text-change'
    DEBUG            : 'debug'

  @sources:
    API    : 'api'
    SILENT : 'silent'
    USER   : 'user'

  @registerFormat: (format) ->
    name = format.blotName || format.attrName
    this.emit(Quill.events.DEBUG, 'warning', "Overwriting #{name} format") if Parchment.match(name)
    Parchment.register(format)

  @registerModule: (name, module) ->
    this.emit(Quill.events.DEBUG, 'warning', "Overwriting #{name} module") if Quill.modules[name]?
    Quill.modules[name] = module

  @registerTheme: (name, theme) ->
    this.emit(Quill.events.DEBUG, 'warning', "Overwriting #{name} theme") if Quill.themes[name]?
    Quill.themes[name] = theme

  @require: (name) ->
    switch name
      when 'delta'     then return Delta
      when 'dom'       then return dom
      when 'parchment' then return Parchment
      when 'range'     then return Selection.Range
      else return null


  constructor: (@container, options = {}) ->
    @container = document.querySelector(@container) if typeof @container == 'string'
    throw new Error('Invalid Quill container') unless @container?
    moduleOptions = extend({}, Quill.DEFAULTS.modules or {}, options.modules)
    html = @container.innerHTML
    @container.innerHTML = ''
    @options = extend({}, Quill.DEFAULTS, options)
    @options.modules = moduleOptions
    @options.id = uniqueId('ql-editor-')
    @modules = {}
    @root = this.addContainer('ql-editor')
    @root.innerHTML = html.trim()  # TODO fix
    @root.setAttribute('id', @options.id)
    @editor = new Editor(@root)
    @selection = new Selection(@editor)
    @editor.onUpdate = (delta, source = Quill.sources.USER) =>
      this.emit(Quill.events.TEXT_CHANGE, delta, source)
    @selection.onUpdate = (range, source = Quill.sources.USER) =>
      this.emit(Quill.events.SELECTION_CHANGE, range, source)
    if @options.theme == false
      @theme = new Quill.themes['base'](this, false)
    else if (themeClass = Quill.themes[@options.theme])
      @theme = new themeClass(this, @options)
    else
      throw new Error("Cannot load #{@options.theme} theme. Are you sure you registered it?")
    # TODO should modules depend on theme?
    Object.keys(@options.modules).forEach((name) =>
      this.addModule(name, @options.modules[name])
    )
    this.disable() if @options.readOnly

  addContainer: (className, before = false) ->
    refNode = if before then @root else null
    container = document.createElement('div')
    container.classList.add(className)
    @container.insertBefore(container, refNode)
    return container

  addModule: (name, options) ->
    moduleClass = Quill.modules[name]
    throw new Error("Cannot load #{name} module. Are you sure you registered it?") unless moduleClass?
    options = {} if options == true   # Allow for addModule('module', true)
    options = extend(moduleClass.DEFAULTS or {}, @theme.constructor.OPTIONS[name], options)
    @modules[name] = new moduleClass(this, options)
    this.emit(Quill.events.MODULE_INIT, name, @modules[name])
    return @modules[name]

  deleteText: (start, end, source = Quill.sources.API) ->
    track.call(this, source, =>
      @editor.deleteAt(start, end - start)
    )

  disable: ->
    @editor.enable(false)

  enable: (enabled = true) ->
    @editor.enable(enabled)

  emit: (eventName, args...) ->
    super(Quill.events.PRE_EVENT, eventName, args...)
    super(eventName, args...)
    super(Quill.events.POST_EVENT, eventName, args...)

  focus: ->
    @selection.focus()

  formatLine: (start, end, name, value, source) ->
    [start, end, formats, source] = buildParams(start, end, name, value, source)
    track.call(this, source, =>
      # TODO handle lists
      Object.keys(formats).forEach((format) =>
        @editor.children.forEachAt(start, end - start, (line, offset) ->
          line.format(format, formats[format])
        )
      )
    )

  formatText: (start, end, name, value, source) ->
    [start, end, formats, source] = buildParams(start, end, name, value, source)
    track.call(this, source, =>
      Object.keys(formats).forEach((format) =>
        @editor.formatAt(start, end - start, format, formats[format])
      )
    )

  getBounds: (index) ->
    return @selection.getBounds(index)

  getContents: (start = 0, end = undefined) ->
    [start, end] = buildParams(start, end)
    return @editor.getDelta().slice(start, end)

  getHTML: ->
    # TODO fix
    return @root.innerHTML

  getLength: ->
    return @editor.getLength()

  getModule: (name) ->
    return @modules[name]

  getSelection: (focus = false) ->
    this.focus() if focus
    this.update()   # Make sure we access getRange with editor in consistent state
    return @selection.getRange()

  getText: (start = 0, end = undefined) ->
    [start, end] = buildParams(start, end)
    values = [].concat.apply([], @editor.getValue())
    return values.map((value) ->
      return if typeof value == 'string' then value else ''
    ).join('').slice(start, end)

  insertEmbed: (index, embed, value, source) ->
    [index, end, formats, source] = buildParams(index, 0, embed, value, source)
    track.call(this, source, =>
      @editor.insertEmbed(index, embed, value, source)
    )

  insertText: (index, text, name, value, source) ->
    [index, end, formats, source] = buildParams(index, 0, name, value, source)
    track.call(this, source, =>
      @editor.insertText(index, text, source)
      Object.keys(formats).forEach((format) =>
        @editor.formatAt(index, text.length, name, value)
      )
    )

  onModuleLoad: (name, callback) ->
    if (@modules[name]) then return callback(@modules[name])
    this.on(Quill.events.MODULE_INIT, (moduleName, module) ->
      callback(module) if moduleName == name
    )

  prepareFormat: (name, value) ->
    @selection.prepare(name, value)

  setContents: (delta, source = Quill.sources.API) ->
    if Array.isArray(delta)
      delta = new Delta(delta.slice())
    else
      delta = delta.slice()
    track.call(this, source, =>
      @editor.deleteText(0, @editor.getLength())
      applyDelta(@editor, delta)
    )

  setSelection: (start, end, source = Quill.sources.API) ->
    if typeof start == 'number' and typeof end == 'number'
      range = new Selection.Range(start, end)
    else
      range = start
      source = end or source
    @selection.setRange(range, source)

  setText: (text, source = Quill.sources.API) ->
    delta = new Delta().insert(text)
    this.setContents(delta, source)

  update: (source = Quill.sources.USER) ->
    delta = @editor.update(source)
    source = Quill.sources.SILENT if delta.length() > 0
    @selection.update(source)

  updateContents: (delta, source = Quill.sources.API) ->
    delta = new Delta(delta.slice()) if Array.isArray(delta)
    track.call(this, source, =>
      applyDelta(@editor, delta)
    )


applyDelta = (editor, delta) ->
  delta.ops.reduce((index, op) =>
    if op.insert?
      if typeof op.insert == 'string'
        editor.insertAt(index, op.insert)
        length = op.insert.length
      else
        editor.insertAt(index, op.attributes)
        length = 1
      # TODO handle attributes
      return index + length
    else if typeof op.delete == 'number'
      editor.deleteAt(index, op.delete)
      return index
    else if typeof op.retain == 'number'
      Object.keys(op.attributes).forEach((name) =>
        editor.formatAt(index, op.retain, name, op.attributes[name])
      )
      return index + op.retain
  , 0)

# fn(Number start, Number end, String name, String value, String source)
# fn(Number start, Number end, Object formats, String source)
# fn(Object range, String name, String value, String source)
# fn(Object range, Object formats, String source)
buildParams = (params...) ->
  if typeof params[0] == 'object'
    params.splice(0, 1, params[0].start, params[0].end)
  if typeof params[2] == 'string'
    formats = {}
    formats[params[2]] = params[3]
    params.splice(2, 2, formats)
  params[3] ?= Quill.sources.API
  return params

track = (source, callback) ->
  this.update()
  callback.call(this)
  this.update(source)

uniqueId = (prefix) ->
  this.counter = this.counter || 1
  return (prefix) + (this.counter++)


Quill.registerTheme('base', require('./themes/base'))
Quill.registerTheme('snow', require('./themes/snow'))


module.exports = Quill
