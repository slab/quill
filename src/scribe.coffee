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
    formats.name = value
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
    PRE_EVENT        : 'pre-event'
    POST_EVENT       : 'post-event'
    SELECTION_CHANGE : 'selection-change'
    TEXT_CHANGE      : 'text-change'

  constructor: (container, options = {}) ->
    @options = _.defaults(options, Scribe.DEFAULTS)
    @editor = new ScribeEditor(container, this, @options)
    Scribe.editors.push(@editor)
    @theme = new Scribe.themes[@options.theme](@editor)
    @modules = _.reduce(@options.modules, (modules, options, name) =>
      modules[name] = @theme.addModule(name, options)
      return modules
    , {})

  addModule: (name, options) ->
    @theme.addModule(name, options)

  deleteText: (index, length) ->
    delta = Tandem.Delta.makeDeleteDelta(this.getLength(), index, length)
    editor.applyDelta(delta)

  formatText: (index, length, name, value) ->
    formats = buildFormats(name, value)
    delta = Tandem.Delta.makeRetainDelta(this.getLength(), index, length, formats)
    editor.applyDelta(delta)

  getContents: (index = 0, length = 0) ->
    length = this.getLength() - index unless length?
    ops = @editor.getDelta().getOpsAt(index, length)
    return new Tandem.Delta(0, ops)

  getLength: ->
    return @editor.getDelta().endLength

  getText: (index, length) ->
    return _.pluck(this.getContents(index, length), 'value').join('')

  insertText: (index, length, name, value) ->
    formats = buildFormats(name, value)
    delta = Tandem.Delta.makeInsertDelta(@delta.endLength, index, text, formats)
    @editor.applyDelta(delta)

  setContents: (delta) ->
    if _.isArray(delta)
      delta = new Tandem.Delta(0, delta)
    delta.startLength = this.getLength()
    @editor.applyDelta(delta)

  updateContents: (delta) ->
    @editor.applyDelta(delta)


module.exports = Scribe
