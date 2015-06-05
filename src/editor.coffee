_         = require('lodash')
dom       = require('./lib/dom')
Delta     = require('rich-text/lib/delta')
Parchment = require('parchment')
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


class Editor
  @sources:
    API    : 'api'
    SILENT : 'silent'
    USER   : 'user'

  constructor: (@root, @quill, @options = {}) ->
    @root.setAttribute('id', @options.id)
    @parchment = new Parchment(@root)
    # @delta = @doc.toDelta()
    @length = @parchment.length()
    @selection = new Selection(@parchment, @quill)
    @timer = setInterval(_.bind(this.checkUpdate, this), @options.pollInterval)
    this.enable() unless @options.readOnly

  insertText: (index, text, source) ->
    @parchment.insertAt(index, text, source)

  insertEmbed: (index, embed, value) ->
    @parchment.insertAt(index, embed, value)

  deleteText: (start, end, source) ->
    @parchment.deleteAt(start, end - start)

  formatLine: (start, end, formats, source) ->
    @parchment.children.forEachAt(start, end - start, (line, offset) ->
      _.each(formats, (value, name) ->
        line.format(name, value)
      )
    )

  formatText: (start, end, formats, source) ->
    _.each(formats, (value, name) ->
      @parchment.formatAt(start, end - start, name, value)
    )

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
    if @selection.range?
      @selection.setRange(@selection.range)
    else
      @root.focus()

  getBounds: (index) ->
    # this.checkUpdate()
    pos = _.last(@parchment.findPath(index))      # TODO inclusive
    # [leaf, offset] = @doc.findLeafAt(index, true)
    throw new Error('Invalid index') unless pos?
    leafNode = pos.blot.domNode
    containerBounds = @root.parentNode.getBoundingClientRect()
    side = 'left'
    if pos.blot.length() == 0   # BR case
      bounds = leafNode.parentNode.getBoundingClientRect()
    else if dom.VOID_TAGS[leafNode.tagName]
      bounds = leafNode.getBoundingClientRect()
      side = 'right' if pos.offset == 1
    else
      range = document.createRange()
      if pos.offset < pos.blot.length()
        range.setStart(leafNode, pos.offset)
        range.setEnd(leafNode, pos.offset + 1)
      else
        range.setStart(leafNode, pos.offset - 1)
        range.setEnd(leafNode, pos.offset)
        side = 'right'
      bounds = range.getBoundingClientRect()
    return {
      height: bounds.height
      left: bounds[side] - containerBounds.left
      top: bounds.top - containerBounds.top
    }

  # _trackDelta: (fn) ->
  #   oldIndex = @savedRange?.start
  #   fn()
  #   newDelta = @doc.toDelta()
  #   @savedRange = @selection.getRange()
  #   newIndex = @savedRange?.start
  #   try
  #     if oldIndex? and newIndex? and oldIndex <= @delta.length() and newIndex <= newDelta.length()
  #       oldLeftDelta = @delta.slice(0, oldIndex)
  #       oldRightDelta = @delta.slice(oldIndex)
  #       newLeftDelta = newDelta.slice(0, newIndex)
  #       newRightDelta = newDelta.slice(newIndex)
  #       diffLeft = oldLeftDelta.diff(newLeftDelta)
  #       diffRight = oldRightDelta.diff(newRightDelta)
  #       return new Delta(diffLeft.ops.concat(diffRight.ops))
  #   catch ignored
  #   return @delta.diff(newDelta)

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
