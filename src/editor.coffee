_         = require('lodash')
dom       = require('./lib/dom')
Delta     = require('rich-text/lib/delta')
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

Document = require('./blots/document')
Block    = require('./blots/block')
Break    = require('./blots/break')


class Editor
  @sources:
    API    : 'api'
    SILENT : 'silent'
    USER   : 'user'

  constructor: (@root, @quill, @options = {}) ->
    @root.setAttribute('id', @options.id)
    @root.innerHTML = @root.innerHTML.trim().replace(/\s/g, '')  # TODO fix
    @doc = new Document(@root, @options)
    @length = @doc.getLength()
    @selection = new Selection(@doc, @quill)
    this.enable() unless @options.readOnly

  applyDelta: (delta, source) ->
    this.update()
    # TODO implement
    this.update(source)

  deleteText: (start, end, source) ->
    this.update()
    @doc.deleteAt(start, end - start)
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
    @doc.children.forEachAt(start, end - start, (line, offset) ->
      Object.keys(formats).forEach((name) ->
        line.format(name, formats[name])
      )
    )
    this.update(source)

  formatText: (start, end, formats, source) ->
    this.update()
    _.each(formats, (value, name) =>
      @doc.formatAt(start, end - start, name, value)
    )
    this.update(source)

  getContents: (start, end) ->
    return @doc.getDelta()

  getLength: ->
    return @doc.getLength()

  getText: (start, end) ->
    values = [].concat.apply([], @doc.getValue())
    text = values.map((value) ->
      return if _.isString(value) then value else dom.EMBED_TEXT
    ).join('').slice(start, end)
    return text

  insertEmbed: (index, embed, value) ->
    this.update()
    @doc.insertAt(index, embed, value)
    this.update(source)

  insertText: (index, text, source) ->
    this.update()
    @doc.insertAt(index, text)
    this.update(source)

  update: (source = 'user') ->
    if (delta = @doc.update())
      @quill.emit(@quill.constructor.events.TEXT_CHANGE, delta, source)


module.exports = Editor
