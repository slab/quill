_         = require('lodash')
dom       = require('./lib/dom')
Delta     = require('rich-text/lib/delta')
EventEmitter2 = require('eventemitter2').EventEmitter2
Selection = require('./selection')

Bold      = require('./formats/bold')
Italic    = require('./formats/italic')
Strike    = require('./formats/strike')
Underline = require('./formats/underline')
Link      = require('./formats/link')

Image     = require('./formats/image')

Background = require('./formats/background')
Color      = require('./formats/color')
Font       = require('./formats/font')
Size       = require('./formats/size')

Block = require('./blots/block')
Break = require('./blots/break')


class Editor extends EventEmitter2
  @sources:
    API    : 'api'
    SILENT : 'silent'
    USER   : 'user'

  constructor: (@root, @quill, @options = {}) ->
    @root.setAttribute('id', @options.id)
    @root.innerHTML = @root.innerHTML.trim()
    @parchment = new Parchment(@root)
    @length = @parchment.getLength()
    @selection = new Selection(@parchment, @quill)
    this.enable() unless @options.readOnly

  applyDelta: (delta, source) ->
    this.update()
    # TODO implement
    this.update(source)

  deleteText: (start, end, source) ->
    this.update()
    @parchment.deleteAt(start, end - start)
    this.update(source)

  disable: ->
    this.enable(false)

  enable: (enabled = true) ->
    @root.setAttribute('contenteditable', enabled)

  focus: ->
    if @selection.range?
      @selection.setRange(@selection.range)
    else
      @root.focus()

  formatLine: (start, end, formats, source) ->
    this.update()
    @parchment.children.forEachAt(start, end - start, (line, offset) ->
      Object.keys(formats).forEach((name) ->
        line.format(name, formats[name])
      )
    )
    this.update(source)

  formatText: (start, end, formats, source) ->
    this.update()
    _.each(formats, (value, name) =>
      @parchment.formatAt(start, end - start, name, value)
    )
    this.update(source)

  getContents: (start, end) ->
    values = [].concat.apply([], @parchment.values())
    formats = [].concat.apply([], @parchment.formats())
    delta = new Delta()
    return values.reduce((delta, value, index) ->
      return delta.insert(value, formats[index])
    , new Delta()).slice(start, end)

  getLength: ->
    return @parchment.getLength()

  getText: (start, end) ->
    values = [].concat.apply([], @parchment.values())
    text = values.map((value) ->
      return if _.isString(value) then value else dom.EMBED_TEXT
    ).join('').slice(start, end)
    return text

  insertEmbed: (index, embed, value) ->
    this.update()
    @parchment.insertAt(index, embed, value)
    this.update(source)

  insertText: (index, text, source) ->
    this.update()
    @parchment.insertAt(index, text)
    this.update(source)

  update: (source = 'user') ->
    @parchment.update(source)


module.exports = Editor
