_             = require('lodash')
pkg           = require('../package.json')
Delta         = require('rich-text/lib/delta')
EventEmitter2 = require('eventemitter2').EventEmitter2
dom           = require('./lib/dom')
Editor        = require('./editor')
Parchment     = require('parchment')
Range         = require('./lib/range')

Selection = require('./selection')

Bold      = require('./formats/bold')
Italic    = require('./formats/italic')
Strike    = require('./formats/strike')
Underline = require('./formats/underline')
Link      = require('./formats/link')

List      = require('./formats/list')

Image     = require('./formats/image')

Background = require('./formats/background')
Color      = require('./formats/color')
Font       = require('./formats/font')
Size       = require('./formats/size')

Align    = require('./formats/align')

Block    = require('./blots/block')
Block    = require('./blots/break')
Cursor   = require('./blots/cursor')


class Quill extends EventEmitter2
  @version: pkg.version

  @modules: {}
  @themes: {}

  @DEFAULTS:
    formats: [
      'align',
      'bullet', 'list',
      'bold', 'italic', 'strike', 'underline',
      'link',
      'background', 'color', 'font', 'size',
      'image'
    ]
    modules: {}
      # 'keyboard': true
      # 'paste-manager': true
      # 'undo-manager': true
    readOnly: false
    theme: 'base'

  @events:
    FORMAT_INIT      : 'format-init'
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
      when 'lodash'    then return _
      when 'delta'     then return Delta
      when 'dom'       then return dom
      when 'parchment' then return Parchment
      when 'range'     then return Range
      else return null


  constructor: (@container, options = {}) ->
    @container = document.querySelector(@container) if _.isString(@container)
    throw new Error('Invalid Quill container') unless @container?
    moduleOptions = _.defaults(options.modules or {}, Quill.DEFAULTS.modules)
    html = @container.innerHTML
    @container.innerHTML = ''
    @options = _.defaults(options, Quill.DEFAULTS)
    @options.modules = moduleOptions
    @options.id = _.uniqueId('ql-editor-')
    @modules = {}
    @root = this.addContainer('ql-editor')
    @root.innerHTML = html.trim()  # TODO fix
    @root.setAttribute('id', @options.id)
    @editor = new Editor(@root)
    @selection = new Selection(@editor)
    @editor.onUpdate = (delta) =>
      this.emit(Quill.events.TEXT_CHANGE, delta, Quill.sources.USER)
    @selection.onUpdate = (range) =>
      this.emit(Quill.events.SELECTION_CHANGE, range, Quill.sources.USER)
    if (themeClass = Quill.themes[@options.theme])
      @theme = new themeClass(this, @options)
    else
      throw new Error("Cannot load #{@options.theme} theme. Are you sure you registered it?")
    # TODO should modules depend on theme?
    Object.keys(@options.modules).forEach((name) =>
      this.addModule(name, @options.modules[name])
    )
    this.enable() unless @options.readOnly

  addContainer: (className, before = false) ->
    refNode = if before then @root else null
    container = document.createElement('div')
    dom(container).addClass(className)
    @container.insertBefore(container, refNode)
    return container

  addModule: (name, options) ->
    moduleClass = Quill.modules[name]
    throw new Error("Cannot load #{name} module. Are you sure you registered it?") unless moduleClass?
    options = {} if options == true   # Allow for addModule('module', true)
    options = _.defaults(options, @theme.constructor.OPTIONS[name] or {}, moduleClass.DEFAULTS or {})
    @modules[name] = new moduleClass(this, options)
    this.emit(Quill.events.MODULE_INIT, name, @modules[name])
    return @modules[name]

  deleteText: (start, end, source = Quill.sources.API) ->
    track.call(this, source, =>
      @editor.deleteAt(start, end - start)
    )

  disable: ->
    this.enable(false)

  emit: (eventName, args...) ->
    super(Quill.events.PRE_EVENT, eventName, args...)
    super(eventName, args...)
    super(Quill.events.POST_EVENT, eventName, args...)

  enable: (enabled = true) ->
    @root.setAttribute('contenteditable', enabled)

  focus: ->
    @selection.focus()

  formatLine: (start, end, name, value, source) ->
    [start, end, formats, source] = buildParams(start, end, name, value, source)
    track.call(this, source, =>
      # TODO handle lists
      Object.keys(formats).forEach((format) =>
        @editor.children.forEachAt(start, end - start, (line, offset) ->
          line.format(name, value)
        )
      )
    )

  formatText: (start, end, name, value, source) ->
    [start, end, formats, source] = buildParams(start, end, name, value, source)
    track.call(this, source, =>
      Object.keys(formats).forEach((format) =>
        @editor.formatAt(start, end - start, name, value)
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

  getSelection: ->
    this.update()   # Make sure we access getRange with editor in consistent state
    return @selection.getRange()

  getText: (start = 0, end = undefined) ->
    [start, end] = buildParams(start, end)
    values = [].concat.apply([], @editor.getValue())
    text = values.map((value) ->
      return if _.isString(value) then value else dom.EMBED_TEXT
    ).join('').slice(start, end)
    return text

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
    if _.isNumber(start) and _.isNumber(end)
      range = new Range(start, end)
    else
      range = start
      source = end or source
    @selection.setRange(range, source)

  setText: (text, source = Quill.sources.API) ->
    delta = new Delta().insert(text)
    this.setContents(delta, source)

  updateContents: (delta, source = Quill.sources.API) ->
    delta = new Delta(delta.slice()) if Array.isArray(delta)
    track.call(this, source, =>
      applyDelta(@editor, delta)
    )

  update: (source = Quill.sources.USER) ->
    delta = @editor.update()
    if delta.length() > 0
      this.emit(Quill.events.TEXT_CHANGE, delta, source)
    else if (range = @selection.update())
      this.emit(Quill.events.SELECTION_CHANGE, range, source)


applyDelta = (editor, delta) ->
  delta.ops.reduce((index, op) =>
    if op.insert?
      if _.isString(op.insert)
        editor.insertAt(index, op.insert)
        length = op.insert.length
      else
        editor.insertAt(index, op.attributes)
        length = 1
      # TODO handle attributes
      return index + length
    else if _.isNumber(op.delete)
      editor.deleteAt(index, op.delete)
      return index
    else if _.isNumber(op.retain)
      _.each(op.attributes, (value, name) =>
        editor.formatAt(index, op.retain, name, value)
      )
      return index + op.retain
  , 0)

# fn(Number start, Number end, String name, String value, String source)
# fn(Number start, Number end, Object formats, String source)
# fn(Object range, String name, String value, String source)
# fn(Object range, Object formats, String source)
buildParams = (params...) ->
  if _.isObject(params[0])
    params.splice(0, 1, params[0].start, params[0].end)
  if _.isString(params[2])
    formats = {}
    formats[params[2]] = params[3]
    params.splice(2, 2, formats)
  params[3] ?= Quill.sources.API
  return params

track = (source, callback) ->
  this.update()
  callback.call(this)
  this.update(source)


Quill.registerTheme('base', require('./themes/base'))
Quill.registerTheme('snow', require('./themes/snow'))


module.exports = Quill
