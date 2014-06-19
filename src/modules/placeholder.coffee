DOM        = require('../dom')

class Placeholder
  @DEFAULTS:
    text: null
    styles:
      '.placeholder-container:after':
        'content': 'attr(data-placeholder)'
        'left': 0,
        'top': 0
        'position': 'absolute'

  constructor: (@quill, @options) ->
    return unless @options.text?
    @options.styles = _.defaults(@options.styles, Placeholder.DEFAULTS.styles)
    @quill.addStyles(@options.styles)
    @quill.root.setAttribute('data-placeholder', @options.text)
    @quill.on(@quill.constructor.events.TEXT_CHANGE, _.bind(this.textChange, this))
    unless @quill.getLength() > 1
      @enable()   

  enable: (enabled = true) ->
    DOM.toggleClass(@quill.root, 'placeholder-container', enabled)

  disable: ->
    @enable(false)

  textChange: (delta)->
    unless delta.endLength > 1
      @enable()
    else 
      @disable()

module.exports = Placeholder