_                   = require('lodash')
es5shim             = require('es5-shim')
pkg                 = require('../package.json')
EventEmitter2       = require('eventemitter2').EventEmitter2
ScribeEditor        = require('./editor')
ScribeDefaultTheme  = require('./themes/default')
ScribeSnowTheme     = require('./themes/snow')
Tandem              = require('tandem-core')

Modules =
  Authorship    : require('./modules/authorship')
  LinkTooltip   : require('./modules/link-tooltip')
  MultiCursor   : require('./modules/multi-cursor')
  PasteManager  : require('./modules/paste-manager')
  Toolbar       : require('./modules/toolbar')


buildFormats = (name, value) ->
  if _.isString(name)
    formats = {}
    formats[name] = value
  else if _.isObject(name)
    formats = name
  else
    formats = {}
  return formats


class Scribe extends EventEmitter2
  @version: pkg.version
  @editors: []
  @Module: Modules

  @DEFAULTS:
    formats: ['bold', 'italic', 'strike', 'underline', 'link', 'back-color', 'font-name', 'fore-color', 'font-size']
    iframe: true
    logLevel: false
    modules:
      'paste-manager': true
    pollInterval: 100
    readOnly: false
    theme: 'default'
    undoDelay: 1000
    undoMaxStack: 100

  @themes:
    default: ScribeDefaultTheme
    snow: ScribeSnowTheme

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
    @theme = new Scribe.themes[@options.theme](this, @options)
    @theme.init()   # Separate init since some module constructors refer to @theme
    # TODO We should not just be a passthrough
    _.each(ScribeEditor.events, (eventName) =>
      @editor.on(eventName, (args...) =>
        this.emit(eventName, args...)
      )
    )

  addModule: (name, options) ->
    return @theme.addModule(name, options)

  deleteText: (index, length) ->
    delta = Tandem.Delta.makeDeleteDelta(this.getLength(), index, length)
    @editor.applyDelta(delta)

  formatText: (index, length, name, value) ->
    formats = buildFormats(name, value)
    delta = Tandem.Delta.makeRetainDelta(this.getLength(), index, length, formats)
    @editor.applyDelta(delta)

  getContents: (index, length) ->
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

  getText: (index, length) ->
    return _.pluck(this.getContents(index, length).ops, 'value').join('')

  insertText: (index, text, name, value) ->
    formats = buildFormats(name, value)
    delta = Tandem.Delta.makeInsertDelta(this.getLength(), index, text, formats)
    @editor.applyDelta(delta)

  setContents: (delta) ->
    delta = if _.isArray(delta) then new Tandem.Delta(0, delta) else Tandem.Delta.makeDelta(delta)
    delta.startLength = this.getLength()
    @editor.applyDelta(delta)

  setHTML: (html) ->
    @editor.root.innerHTML = html

  updateContents: (delta) ->
    @editor.applyDelta(delta)


module.exports = Scribe
