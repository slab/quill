_     = require('lodash')
DOM   = require('./dom')
Utils = require('./utils')


class Format
  @types:
    LINE: 'line'

  @FORMATS:
    bold:
      tag: 'B'
      prepare: 'bold'

    italic:
      tag: 'I'
      prepare: 'italic'

    underline:
      tag: 'U'
      prepare: 'underline'

    strike:
      tag: 'S'
      prepare: 'strikeThrough'

    color:
      style: 'color'
      default: 'rgb(0, 0, 0)'
      prepare: 'foreColor'

    background:
      style: 'backgroundColor'
      default: 'rgb(255, 255, 255)'
      prepare: 'backColor'

    font:
      style: 'fontFamily'
      default: "'Helvetica', 'Arial', sans-serif"
      prepare: 'fontName'

    size:
      style: 'fontSize'
      default: '13px'
      prepare: (doc, value) ->
        doc.execCommand('fontSize', false, Utils.convertFontSize(value))

    link:
      tag: 'A'
      attribute: 'href'

    image:
      tag: 'IMG'
      attribute: 'src'

    align:
      type: Format.types.LINE
      style: 'textAlign'
      default: 'left'

    bullet:
      type: Format.types.LINE
      exclude: 'list'
      parentTag: 'UL'
      tag: 'LI'

    list:
      type: Format.types.LINE
      exclude: 'bullet'
      parentTag: 'OL'
      tag: 'LI'


  constructor: (@document, @config) ->

  add: (node, value) ->
    return this.remove(node) unless value
    return node if this.value(node) == value
    if _.isString(@config.parentTag)
      parentNode = @document.createElement(@config.parentTag)
      DOM.wrap(parentNode, node)
      if node.parentNode.tagName == node.parentNode.previousSibling?.tagName
        Utils.mergeNodes(node.parentNode.previousSibling, node.parentNode)
      if node.parentNode.tagName == node.parentNode.nextSibling?.tagName
        Utils.mergeNodes(node.parentNode, node.parentNode.nextSibling)
    if _.isString(@config.tag)
      formatNode = @document.createElement(@config.tag)
      if DOM.VOID_TAGS[formatNode.tagName]?
        # TODO use replaceNode
        node.parentNode.insertBefore(formatNode, node) if node.parentNode?
        DOM.removeNode(node)
        node = formatNode
      else if this.isType(Format.types.LINE)
        node = DOM.switchTag(node, @config.tag)
      else
        node = DOM.wrap(formatNode, node)
    if _.isString(@config.style) or _.isString(@config.attribute) or _.isString(@config.class)
      node = this.remove(node) if _.isString(@config.class)
      if DOM.isTextNode(node)
        node = DOM.wrap(@document.createElement(DOM.DEFAULT_INLINE_TAG), node)
      if _.isString(@config.style)
        node.style[@config.style] = value if value != @config.default
      if _.isString(@config.attribute)
        node.setAttribute(@config.attribute, value)
      if _.isString(@config.class)
        DOM.addClass(node, @config.class + value)
    return node

  isType: (type) ->
    return type == @config.type

  match: (node) ->
    return false unless DOM.isElement(node)
    if _.isString(@config.parentTag) and node.parentNode?.tagName != @config.parentTag
      return false
    if _.isString(@config.tag) and node.tagName != @config.tag
      return false
    if _.isString(@config.style) and (!node.style[@config.style] or node.style[@config.style] == @config.default)
      return false
    if _.isString(@config.attribute) and !node.hasAttribute(@config.attribute)
      return false
    if _.isString(@config.class)
      for c in DOM.getClasses(node)
        return true if c.indexOf(@config.class) == 0
      return false
    return true

  prepare: (value) ->
    if _.isString(@config.prepare)
      @document.execCommand(@config.prepare, false, value)
    else if _.isFunction(@config.prepare)
      @config.prepare(@document, value)

  remove: (node) ->
    return node unless this.match(node)
    if _.isString(@config.style)
      node.style[@config.style] = ''    # IE10 requires setting to '', other browsers can take null
      node.removeAttribute('style') unless node.getAttribute('style')  # Some browsers leave empty style attribute
    if _.isString(@config.attribute)
      node.removeAttribute(@config.attribute)
    if _.isString(@config.class)
      for c in DOM.getClasses(node)
        DOM.removeClass(node, c) if c.indexOf(@config.class) == 0
      node.removeAttribute('class') unless node.getAttribute('class')  # Some browsers leave empty style attribute
    if _.isString(@config.tag)
      if this.isType(Format.types.LINE)
        Utils.splitAncestors(node, node.parentNode.parentNode) if node.previousSibling?
        Utils.splitAncestors(node.nextSibling, node.parentNode.parentNode) if node.nextSibling?
        node = DOM.switchTag(node, DOM.DEFAULT_BLOCK_TAG)
      else
        node = DOM.switchTag(node, DOM.DEFAULT_INLINE_TAG)
        DOM.setText(node, DOM.EMBED_TEXT) if DOM.EMBED_TAGS[@config.tag]?   # TODO is this desireable?
    if _.isString(@config.parentTag)
      DOM.unwrap(node.parentNode)
    if node.tagName == DOM.DEFAULT_INLINE_TAG and !node.hasAttributes()
      node = DOM.unwrap(node)
    return node

  value: (node) ->
    return undefined unless this.match(node)
    if _.isString(@config.attribute)
      return node.getAttribute(@config.attribute) or undefined    # So "" does not get returned
    else if _.isString(@config.style)
      return node.style[@config.style] or undefined
    else if _.isString(@config.class)
      for c in DOM.getClasses(node)
        return c.slice(@config.class.length) if c.indexOf(@config.class) == 0
    else if _.isString(@config.tag)
      return true
    return undefined


module.exports = Format
