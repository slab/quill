Scribe = require('../scribe')
Tandem = require('tandem-core')

class Scribe.Attribution
  constructor: (@editor, @authorId, color, enabled = false) ->
    @editor.on(Scribe.Editor.PRE_EVENT, (eventName, delta) =>
      if eventName == Scribe.Editor.events.TEXT_CHANGE
        _.each(delta.ops, (op) =>
          if Tandem.InsertOp.isInsert(op) or _.keys(op.attributes).length > 0
            op.attributes['author'] = @authorId
        )
        delta.apply((index, text) =>
          @editor.formatAt(index, text.length, 'author', @authorId)
        , (=>), (index, length, name, value) =>
          @editor.formatAt(index, length, 'author', @authorId)
        )
    )
    @editor.renderer.addFormat('author', new Scribe.Format.Class(@editor.renderer.root, 'author'))
    this.addAuthor(@authorId, color)
    this.enable() if enabled

  addAuthor: (id, color) ->
    styles = {}
    styles[".editor.attribution .author-#{id}"] = { "background-color": "#{color}" }
    @editor.renderer.addStyles(styles)

  enable: ->
    @editor.root.classList.add('attribution')

  disable: ->
    @editor.root.classList.remove('attribution')


module.exports = Scribe
