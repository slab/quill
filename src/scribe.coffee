_             = require('lodash')
_.str         = require('underscore.string')
es5shim       = require('es5-shim')
pkg           = require('../package.json')
EventEmitter2 = require('eventemitter2').EventEmitter2
ScribeEditor  = require('./editor')
Tandem        = require('tandem-core')

Modules =
  Authorship    : require('./modules/authorship')
  Keyboard      : require('./modules/keyboard')
  LinkTooltip   : require('./modules/link-tooltip')
  MultiCursor   : require('./modules/multi-cursor')
  PasteManager  : require('./modules/paste-manager')
  Toolbar       : require('./modules/toolbar')
  UndoManager   : require('./modules/undo-manager')

Themes =
  Default : require('./themes/default')
  Snow    : require('./themes/snow')


DEFAULT_API_OPTIONS = { silent: false, source: 'api' }


buildFormats = (name, value, options) ->
  if _.isString(name)
    formats = {}
    formats[name] = value
  else
    formats = if _.isObject(name) then name else {}
    options = if _.isObject(value) then value else {}
  return [formats, options]


class Scribe extends EventEmitter2
  @version: pkg.version
  @editors: []

  @Module: Modules
  @Theme: Themes

  @DEFAULTS:
    formats: ['bold', 'italic', 'strike', 'underline', 'link', 'back-color', 'font-name', 'fore-color', 'font-size']
    iframe: true
    logLevel: false
    modules:
      'keyboard': true
      'paste-manager': true
      'undo-manager': true
    pollInterval: 100
    readOnly: false
    theme: 'default'

  @events:
    FOCUS_CHANGE     : 'focus-change'
    MODULE_INIT      : 'module-init'
    SELECTION_CHANGE : 'selection-change'
    TEXT_CHANGE      : 'text-change'

  constructor: (container, options = {}) ->
    @options = _.defaults(options, Scribe.DEFAULTS)
    @options.id = @id = "scribe-#{Scribe.editors.length + 1}"
    @options.emitter = this
    @editor = new ScribeEditor(container, this, @options)
    Scribe.editors.push(@editor)
    themeClass = _.str.capitalize(_.str.camelize(@options.theme))
    @theme = new Scribe.Theme[themeClass](this, @options)
    @theme.init()   # Separate init since some module constructors refer to @theme
    # TODO We should not just be a passthrough
    _.each(ScribeEditor.events, (eventName) =>
      @editor.on(eventName, (args...) =>
        this.emit(eventName, args...)
      )
    )

  addContainer: (className, before = false) ->
    @editor.renderer.addContainer(className, before)

  addModule: (name, options) ->
    return @theme.addModule(name, options)

  addStyles: (styles) ->
    @editor.renderer.addStyles(styles)

  deleteText: (index, length, options = {}) ->
    options = _.defaults(options, DEFAULT_API_OPTIONS)
    delta = Tandem.Delta.makeDeleteDelta(this.getLength(), index, length)
    @editor.applyDelta(delta, options)

  formatText: (index, length, name, value, options = {}) ->
    [formats, options] = buildFormats(name, value, options)
    delta = Tandem.Delta.makeRetainDelta(this.getLength(), index, length, formats)
    @editor.applyDelta(delta, options)

  getContents: (index, length, options = {}) ->
    index = 0 unless index?
    length = this.getLength() - index unless length?
    ops = @editor.getDelta().getOpsAt(index, length)
    return new Tandem.Delta(0, ops)

  getHTML: ->
    return @editor.root.innerHTML

  getLength: ->
    return @editor.getDelta().endLength

  getModule: (name) ->
    return @theme.modules[name]

  getSelection: ->
    return @editor.selection.getRange()

  getText: (index, length) ->
    return _.pluck(this.getContents(index, length).ops, 'value').join('')

  insertText: (index, text, name, value, options = {}) ->
    [formats, options] = buildFormats(name, value, options)
    delta = Tandem.Delta.makeInsertDelta(this.getLength(), index, text, formats)
    @editor.applyDelta(delta, options)

  setContents: (delta) ->
    delta = if _.isArray(delta) then new Tandem.Delta(0, delta) else Tandem.Delta.makeDelta(delta)
    delta.startLength = this.getLength()
    @editor.applyDelta(delta)

  setHTML: (html) ->
    @editor.root.innerHTML = html

  setSelection: (range, options = {}) ->
    options = _.defaults(options, DEFAULT_API_OPTIONS)
    @editor.selection.setRange(range, options.silent)

  updateContents: (delta) ->
    @editor.applyDelta(delta)

  updateSelection: (options = {}) ->
    options = _.defaults(options, DEFAULT_API_OPTIONS)
    @editor.selection.update(options.silent)


module.exports = Scribe
