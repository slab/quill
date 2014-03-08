_             = require('lodash')
ScribeDOM     = require('../dom')
ScribeFormat  = require('../format')
Tandem        = require('tandem-core')


class ScribeAuthorship
  DEFAULTS:
    authorId: null
    color: 'blue'
    enabled: false

  constructor: (@editor, options) ->
    @options = _.defaults(options, ScribeAuthorship.DEFAULTS)
    @authorId = @options.authorId or @editor.options.id
    @editor.on(@editor.constructor.events.PRE_EVENT, (eventName, delta, origin) =>
      if eventName == @editor.constructor.events.TEXT_CHANGE and origin == 'user'
        # Add authorship to insert/format
        _.each(delta.ops, (op) =>
          if Tandem.InsertOp.isInsert(op) or _.keys(op.attributes).length > 0
            op.attributes['author'] = @authorId
        )
        # Apply authorship to our own editor
        authorDelta = new Tandem.Delta(delta.endLength, [new Tandem.RetainOp(0, delta.endLength)])
        attribute = {}
        attribute['author'] = @authorId
        delta.apply((index, text) =>
          _.each(text.split('\n'), (text) ->
            authorDelta = authorDelta.compose(Tandem.Delta.makeRetainDelta(delta.endLength, index, text.length, attribute))
            index += text.length + 1
          )
        , (=>)
        , (index, length, name, value) =>
          authorDelta = authorDelta.compose(Tandem.Delta.makeRetainDelta(delta.endLength, index, length, attribute))
        )
        @editor.applyDelta(authorDelta, { silent: true })
    )
    @editor.doc.formatManager.addFormat('author', new ScribeFormat.Class(@editor.renderer.root, 'author'))
    this.addAuthor(@authorId, @options.color)
    this.attachButton(@options.button) if @options.button?
    this.enable() if @options.enabled

  addAuthor: (id, color) ->
    styles = {}
    styles[".editor.authorship .author-#{id}"] = { "background-color": "#{color}" }
    @editor.renderer.addStyles(styles)

  attachButton: (button) ->
    ScribeDOM.addEventListener(button, 'click', =>
      if ScribeDOM.hasClass(button, 'sc-active')
        this.disable()
      else
        this.enable()
      ScribeDOM.toggleClass(button, 'sc-active')
    )

  enable: ->
    ScribeDOM.addClass(@editor.root, 'authorship')

  disable: ->
    ScribeDOM.removeClass(@editor.root, 'authorship')


module.exports = ScribeAuthorship
