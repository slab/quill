_                   = require('lodash')
pkg                 = require('../package.json')
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


class Scribe
  @version: pkg.version

  @themes:
    default: ScribeDefaultTheme
    snow: ScribeSnowTheme

  constructor: (container, options) ->
    @editor = new ScribeEditor(container, options)

  addModule: (name, options) ->
    @editor.theme.addModule(name, options)

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
