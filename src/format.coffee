_ = require('lodash')


class Format
  @FORMATS:
    'bold':
      tag: 'B'
      value: true
      preformat: 'bold'

    'underline':
      tag: 'U'
      value: true
      preformat: 'underline'

    'strike':
      tag: 'S'
      value: true
      preformat: 'strikeThrough'

    'italic':
      tag: 'I'
      value: true
      preformat: 'italic'

    'link':
      tag: 'A'
      value:
        attribute: 'href'

    'fore-color':
      style: 'color'
      value: (node) ->
        color = node.style.color
        return if color == '#fff' then false else color
      preformat: 'foreColor'

    'back-color':
      style: 'background-color'
      value: (node) ->
        color = node.style.backgroundColor
        return if color == '#000' then false else color
      preformat: 'backColor'

    'font-name':
      style: 'font-family'
      value: (node) ->
        font = node.style.fontFamily
        return if font == 'serif' then false else font
      preformat: 'fontName'

    'font-size':
      style: 'font-size'
      value: (node) ->
        size = node.style.fontSize
        return if size == '13px' then false else size
      preformat: 'fontSize'


  constructor: (@config) ->
    @tag = @config.tag if @config.tag?
    @style = @config.style if @config.style?

  container: (@root, value) ->
    node = @root.ownerDocument.createElement(@tag or 'SPAN')
    node.style[@style] = value if @style?
    return node

  match: (node) ->
    return true if node.tagName == @tag
    return true if @style? and node.style[@style]?
    return false

  remove: (node) ->


  value: (node) ->
    return null unless this.match(node)
    if _.isBoolean(@config.value)
      return @config.value
    else if _.isFunction(@config.value)
      return @config.value(node)
    else if _.isObject(@config.value) and @config.value.attribute?
      return node.getAttribute(@config.value.attribute)
    # TODO class regex
    return null


module.exports = Format
