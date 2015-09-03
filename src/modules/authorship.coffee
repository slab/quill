Quill  = require('../quill')
_      = Quill.require('lodash')
dom    = Quill.require('dom')
Delta  = Quill.require('delta')


class Authorship
  @DEFAULTS:
    authorId: null
    color: 'transparent'
    enabled: false

  constructor: (@quill, @options) ->
    this.attachButton(@options.button) if @options.button?
    this.enable() if @options.enabled
    @quill.addFormat('author', { class: 'author-' })
    return unless @options.authorId?
    @quill.on(@quill.constructor.events.PRE_EVENT, (eventName, delta, origin) =>
      if eventName == @quill.constructor.events.TEXT_CHANGE and origin == 'user'
        authorDelta = new Delta()
        authorFormat = { author: @options.authorId }
        delta.ops.forEach((op) =>
          return if op.delete?
          if op.insert? or (op.retain? and op.attributes?)
            # Add authorship to insert/format
            op.attributes or= {}
            op.attributes.author = @options.authorId
            # Apply authorship to our own editor
            authorDelta.retain(op.retain or op.insert.length or 1, authorFormat)
          else
            authorDelta.retain(op.retain)
        )
        @quill.updateContents(authorDelta, Quill.sources.SILENT)
    )
    this.addAuthor(@options.authorId, @options.color)

  addAuthor: (id, color) ->
    @quill.theme.addStyles(".authorship .author-#{id} { \"background-color: #{color};\" }")

  attachButton: (button) ->
    button.addEventListener('click', =>
      button.classList.toggle('ql-on')
      this.enable(button.classList.contains('ql-on'))
    )

  enable: (enabled = true) ->
    return if enabled == @quill.root.classList.contains('authorship')
    @quill.root.classList.toggle('authorship')

  disable: ->
    this.enable(false)


Quill.registerModule('authorship', Authorship)
module.exports = Authorship
