ScribeDOM     = require('../dom')
ScribeEditor  = require('../editor')
ScribeFormat  = require('../format')
Tandem        = require('tandem-core')


class ScribeAttribution
  constructor: (@editor, @authorId, color, enabled = false) ->
    @editor.on(ScribeEditor.events.PRE_EVENT, (eventName, delta) =>
      if eventName == ScribeEditor.events.USER_TEXT_CHANGE
        # Add authorship to insert/format
        _.each(delta.ops, (op) =>
          if Tandem.InsertOp.isInsert(op) or _.keys(op.attributes).length > 0
            op.attributes['author'] = @authorId
        )
        # Apply authorship to our own editor
        delta.apply((index, text) =>
          @editor.formatAt(index, text.length, 'author', @authorId, { silent: true })
        , (=>), (index, length, name, value) =>
          @editor.formatAt(index, length, 'author', @authorId, { silent: true })
        )
    )
    @editor.doc.formatManager.addFormat('author', new ScribeFormat.Class(@editor.renderer.root, 'author'))
    this.addAuthor(@authorId, color)
    this.enable() if enabled

  addAuthor: (id, color) ->
    styles = {}
    styles[".editor.attribution .author-#{id}"] = { "background-color": "#{color}" }
    @editor.renderer.addStyles(styles)

  enable: ->
    ScribeDOM.addClass(@editor.root, 'attribution')

  disable: ->
    ScribeDOM.removeClass(@editor.root, 'attribution')


module.exports = ScribeAttribution
