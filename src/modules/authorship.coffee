Quill  = require('../quill')
_      = Quill.require('lodash')
dom    = Quill.require('dom')
Tandem = Quill.require('tandem-core')


class Authorship
  @DEFAULTS:
    authorId: null
    color: 'white'
    enabled: false

  constructor: (@quill, @options) ->
    this.attachButton(@options.button) if @options.button?
    this.enable() if @options.enabled
    @quill.addFormat('author', { class: 'author-' })
    return unless @options.authorId?
    @quill.on(@quill.constructor.events.PRE_EVENT, (eventName, delta, origin) =>
      if eventName == @quill.constructor.events.TEXT_CHANGE and origin == 'user'
        # Add authorship to insert/format
        _.each(delta.ops, (op) =>
          if Tandem.InsertOp.isInsert(op) or _.keys(op.attributes).length > 0
            op.attributes['author'] = @options.authorId
        )
        # Apply authorship to our own editor
        authorDelta = new Tandem.Delta(delta.endLength, [new Tandem.RetainOp(0, delta.endLength)])
        attribute = { author: @options.authorId }
        delta.apply((index, text) =>
          authorDelta = authorDelta.compose(Tandem.Delta.makeRetainDelta(delta.endLength, index, text.length, attribute))
        , (=>)
        , (index, length, name, value) =>
          authorDelta = authorDelta.compose(Tandem.Delta.makeRetainDelta(delta.endLength, index, length, attribute))
        )
        @quill.updateContents(authorDelta, 'silent')
    )
    this.addAuthor(@options.authorId, @options.color)

  addAuthor: (id, color) ->
    styles = {}
    styles[".authorship .author-#{id}"] = { "background-color": "#{color}" }
    @quill.addStyles(styles)

  attachButton: (button) ->
    $button = dom(button)
    $button.addEventListener('click', =>
      $button.toggleClass('ql-on')
      this.enable($dom.hasClass('ql-on'))
    )

  enable: (enabled = true) ->
    dom(@quill.root).toggleClass('authorship', enabled)

  disable: ->
    this.enable(false)


Quill.registerModule('authorship', Authorship)
module.exports = Authorship
