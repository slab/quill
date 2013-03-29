Scribe = require('../scribe')
Tandem = require('tandem-core')


class Scribe.Attribution
  constructor: (@editor, @authorId, color) ->
    @editor.on(Scribe.Editor.PRE_EVENT, (eventName, delta) =>
      if eventName == Scribe.Editor.events.TEXT_CHANGE
        _.each(delta.ops, (op) =>
          op.attributes['author'] = @authorId if Tandem.InsertOp.isInsert(op)
        )
        delta.apply((index, text) =>
          @editor.formatAt(index, text.length, 'author', @authorId)
        )
    )
    this.addAuthor(@authorId, color)

  addAuthor: (id, color) ->
    styles = {}
    styles[".editor .author-#{id}"] = { "background-color": "#{color}" }
    @editor.renderer.addStyles(styles)

module.exports = Scribe
