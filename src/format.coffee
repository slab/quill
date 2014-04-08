_   = require('lodash')
DOM = require('./dom')


class Format
  @FORMATS:
    bold:
      tag: 'B'
      preformat: 'bold'

    underline:
      tag: 'U'
      preformat: 'underline'

    strike:
      tag: 'S'
      preformat: 'strikeThrough'

    italic:
      tag: 'I'
      preformat: 'italic'

    color:
      style: 'color'
      preformat: 'foreColor'

    background:
      style: 'backgroundColor'
      preformat: 'backColor'

    font:
      style: 'fontFamily'
      preformat: 'fontName'

    size:
      style: 'fontSize'
      preformat: 'fontSize'

    link:
      tag: 'A'
      attribute: 'href'

    image:
      tag: 'IMG'
      attribute: 'src'


  constructor: (@config) ->

  container: (@root, value) ->
    node = @root.ownerDocument.createElement(@config.tag or 'SPAN')
    node.style[@config.style] = value if _.isString(@config.style)
    node.setAttribute(@config.attribute, value) if _.isString(@config.attribute)
    return node

  match: (node) ->
    return false unless DOM.isElement(node)
    return false if _.isString(@config.tag) and node.tagName != @config.tag
    return false if _.isString(@config.style) and !node.style[@config.style]
    return false if _.isString(@config.attribute) and !node.hasAttribute(@config.attribute)
    return true

  remove: (node) ->
    return unless this.match(node)
    if _.isString(@config.style)
      node.style[@config.style] = null
    if _.isString(@config.attribute)
      node.removeAttribute(@config.attribute)
    if _.isString(@config.tag)
      if _.keys(DOM.getAttributes(node)).length > 0
        return DOM.switchTag(node, 'span')
      else
        return DOM.unwrap(node)
    return node

  value: (node) ->
    return @config.value(node) or null if _.isFunction(@config.value)
    return node.style[@config.style] or null if _.isString(@config.style)
    return node.getAttribute(@config.attribute) or null if _.isString(@config.attribute)
    return true if _.isString(@config.tag) and node.tagName == @config.tag
    # TODO class regex
    return false


module.exports = Format
