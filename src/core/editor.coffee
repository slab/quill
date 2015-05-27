_         = require('lodash')
dom       = require('../lib/dom')
Delta     = require('rich-text/lib/delta')
Document  = require('./document')
Line      = require('./line')
Parchment = require('parchment')
Selection = require('./selection')

Bold = require('./formats/bold')
Italic = require('./formats/italic')
Strike = require('./formats/strike')
Underline = require('./formats/underline')
Image = require('./formats/image')
Link = require('./formats/link')

class Editor
  @sources:
    API    : 'api'
    SILENT : 'silent'
    USER   : 'user'

  constructor: (@root, @quill, @options = {}) ->
    @root.setAttribute('id', @options.id)
    @parchment = new Parchment(@root)
    # @doc = new Document(@root, @options)
    # @delta = @doc.toDelta()
    # @length = @delta.length()
    # @selection = new Selection(@doc, @quill)
    @timer = setInterval(_.bind(this.checkUpdate, this), @options.pollInterval)
    this.enable() unless @options.readOnly

  insertText: (index, text) ->
    @parchment.insertAt(index, text)

  insertEmbed: (index, embed, value) ->
    @parchment.insertAt(index, embed, value)

  deleteText: (start, end) ->
    @parchment.deleteAt(start, end - start)

  formatText: (start, end, name, value) ->
    @parchment.formatAt(start, end - start, name, value)

  getContents: (start, end) ->
    values = [].concat.apply([], @parchment.values())
    formats = [].concat.apply([], @parchment.formats())
    delta = new Delta()
    return values.reduce((delta, value, index) ->
      return delta.insert(value, formats[index])
    , new Delta()).slice(start, end)

  getLength: ->
    return @parchment.length()

  getText: (start, end) ->
    values = [].concat.apply([], @parchment.values())
    text = values.map((value) ->
      return if _.isString(value) then value else dom.EMBED_TEXT
    ).join('').slice(start, end)
    return text

  # destroy: ->
  #   clearInterval(@timer)

  disable: ->
    this.enable(false)

  enable: (enabled = true) ->
    @root.setAttribute('contenteditable', enabled)

  checkUpdate: (source = 'user') ->
    return clearInterval(@timer) unless @root.parentNode?
    delta = this._update()
    # if delta
    #   @delta.compose(delta)
    #   @length = @delta.length()
    #   @quill.emit(@quill.constructor.events.TEXT_CHANGE, delta, source)
    # source = Editor.sources.SILENT if delta
    # @selection.update(source)

  focus: ->
    # if @selection.range?
    #   @selection.setRange(@selection.range)
    # else
    #   @root.focus()

  getBounds: (index) ->
    # this.checkUpdate()
    # [leaf, offset] = @doc.findLeafAt(index, true)
    # throw new Error('Invalid index') unless leaf?
    # containerBounds = @root.parentNode.getBoundingClientRect()
    # side = 'left'
    # if leaf.length == 0   # BR case
    #   bounds = leaf.node.parentNode.getBoundingClientRect()
    # else if dom.VOID_TAGS[leaf.node.tagName]
    #   bounds = leaf.node.getBoundingClientRect()
    #   side = 'right' if offset == 1
    # else
    #   range = document.createRange()
    #   if offset < leaf.length
    #     range.setStart(leaf.node, offset)
    #     range.setEnd(leaf.node, offset + 1)
    #   else
    #     range.setStart(leaf.node, offset - 1)
    #     range.setEnd(leaf.node, offset)
    #     side = 'right'
    #   bounds = range.getBoundingClientRect()
    # return {
    #   height: bounds.height
    #   left: bounds[side] - containerBounds.left
    #   top: bounds.top - containerBounds.top
    # }

  # _trackDelta: (fn) ->
  #   fn()
  #   newDelta = @doc.toDelta()
  #   # TODO need to get this to prefer earlier insertions
  #   delta = @delta.diff(newDelta)
  #   return delta

  _update: ->
    return false if @innerHTML == @root.innerHTML
    @parchment = new Parchment(@root)
    console.log(@parchment.length())
    @innerHTML = @root.innerHTML
  #   delta = this._trackDelta( =>
  #     @selection.preserve(_.bind(@doc.rebuild, @doc))
  #     @selection.shiftAfter(0, 0, _.bind(@doc.optimizeLines, @doc))
  #   )
  #   @innerHTML = @root.innerHTML
  #   return if delta.ops.length > 0 then delta else false


module.exports = Editor
