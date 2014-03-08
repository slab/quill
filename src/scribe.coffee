_                   = require('lodash')
pkg                 = require('../package.json')
EventEmitter2       = require('eventemitter2').EventEmitter2
ScribeEditor        = require('./editor')
ScribeDefaultTheme  = require('./themes/default')
ScribeSnowTheme     = require('./themes/snow')
Tandem              = require('tandem-core')


buildFormats = (name, value) ->
  if value?
    formats = {}
    formats[name] = value
  else
    formats = name
  return formats


class Scribe extends EventEmitter2
  @version: pkg.version
  @editors: []

  @DEFAULTS:
    readonly: false
    iframe: true
    logLevel: false
    pollInterval: 100
    formats: ['bold', 'italic', 'strike', 'underline', 'link', 'back-color', 'font-name', 'fore-color', 'font-size']
    theme: 'default'
    undoDelay: 1000
    undoMaxStack: 100

  @themes:
    default: ScribeDefaultTheme
    snow: ScribeSnowTheme

  @events:
    FOCUS_CHANGE     : 'focus-change'
    SELECTION_CHANGE : 'selection-change'
    TEXT_CHANGE      : 'text-change'

  constructor: (container, options = {}) ->
    @options = _.defaults(options, Scribe.DEFAULTS)
    @options.id = @id = "scribe-#{Scribe.editors.length + 1}"
    @options.emitter = this
    @editor = new ScribeEditor(container, this, @options)
    Scribe.editors.push(@editor)
    @theme = new Scribe.themes[@options.theme](@editor)
    @modules = _.reduce(@options.modules, (modules, options, name) =>
      modules[name] = @theme.addModule(name, options)
      return modules
    , {})
    # TODO We should not just be a passthrough
    _.each(ScribeEditor.events, (eventName) =>
      @editor.on(eventName, (args...) =>
        this.emit(eventName, args...)
      )
    )

  addModule: (name, options) ->
    @modules[name] = @theme.addModule(name, options)
    return @modules[name]

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

  getLength: ->
    return @editor.getDelta().endLength

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

  updateContents: (delta) ->
    @editor.applyDelta(delta)


module.exports = Scribe
