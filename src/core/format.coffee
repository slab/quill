_   = require('lodash')
dom = require('../lib/dom')


class Format
  @types:
    LINE: 'line'
    EMBED: 'embed'

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
      prepare: (value) ->
        document.execCommand('fontSize', false, dom.convertFontSize(value))

    link:
      tag: 'A'
      add: (node, value) ->
        node.setAttribute('href', value)
        return node
      remove: (node) ->
        node.removeAttribute('href')
        return node
      value: (node) ->
        return node.getAttribute('href')

    image:
      type: Format.types.EMBED
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


  constructor: (@config) ->

  add: (node, value) ->
    return this.remove(node) unless value
    return node if this.value(node) == value
    if _.isString(@config.parentTag)
      parentNode = node.parentNode;
      if parentNode.tagName != @config.parentTag
          parentNode = document.createElement(@config.parentTag)
          dom(node).wrap(parentNode)
      if node.parentNode.tagName == node.parentNode.previousSibling?.tagName
        dom(node.parentNode.previousSibling).merge(node.parentNode)
      if node.parentNode.tagName == node.parentNode.nextSibling?.tagName
        dom(node.parentNode).merge(node.parentNode.nextSibling)
    if _.isString(@config.tag) and node.tagName != @config.tag
      formatNode = document.createElement(@config.tag)
      if dom.VOID_TAGS[formatNode.tagName]?
        dom(node).replace(formatNode) if node.parentNode?
        node = formatNode
      else if this.isType(Format.types.LINE)
        node = dom(node).switchTag(@config.tag).get()
      else
        dom(node).wrap(formatNode)
        node = formatNode
    if _.isString(@config.style) or _.isString(@config.attribute) or _.isString(@config.class)
      if _.isString(@config.class)
        node = this.remove(node)
      if dom(node).isTextNode()
        inline = document.createElement(dom.DEFAULT_INLINE_TAG)
        dom(node).wrap(inline)
        node = inline
      if _.isString(@config.style)
        node.style[@config.style] = value if value != @config.default
      if _.isString(@config.attribute)
        node.setAttribute(@config.attribute, value)
      if _.isString(@config.class)
        dom(node).addClass(@config.class + value)
    if _.isFunction(@config.add)
      node = @config.add(node, value)
    return node

  isType: (type) ->
    return type == @config.type

  match: (node) ->
    return false unless dom(node).isElement()
    if _.isString(@config.parentTag) and node.parentNode?.tagName != @config.parentTag
      return false
    if _.isString(@config.tag) and node.tagName != @config.tag
      return false
    if _.isString(@config.style) and (!node.style[@config.style] or node.style[@config.style] == @config.default)
      return false
    if _.isString(@config.attribute) and !node.hasAttribute(@config.attribute)
      return false
    if _.isString(@config.class)
      for c in dom(node).classes()
        return true if c.indexOf(@config.class) == 0
      return false
    return true

  prepare: (value) ->
    if _.isString(@config.prepare)
      document.execCommand(@config.prepare, false, value)
    else if _.isFunction(@config.prepare)
      @config.prepare(value)

  remove: (node) ->
    return node unless this.match(node)
    if _.isString(@config.style)
      node.style[@config.style] = ''    # IE10 requires setting to '', other browsers can take null
      node.removeAttribute('style') unless node.getAttribute('style')  # Some browsers leave empty style attribute
    if _.isString(@config.attribute)
      node.removeAttribute(@config.attribute)
    if _.isString(@config.class)
      for c in dom(node).classes()
        dom(node).removeClass(c) if c.indexOf(@config.class) == 0
    if _.isString(@config.tag)
      if this.isType(Format.types.LINE)
        if _.isString(@config.parentTag)
          dom(node).splitBefore(node.parentNode.parentNode) if node.previousSibling?
          dom(node.nextSibling).splitBefore(node.parentNode.parentNode) if node.nextSibling?
        node = dom(node).switchTag(dom.DEFAULT_BLOCK_TAG).get()
      else if this.isType(Format.types.EMBED)
        dom(node).remove()
        return undefined
      else
        node = dom(node).switchTag(dom.DEFAULT_INLINE_TAG).get()
    if _.isString(@config.parentTag)
      dom(node.parentNode).unwrap()
    if _.isFunction(@config.remove)
      node = @config.remove(node)
    if node.tagName == dom.DEFAULT_INLINE_TAG and !node.hasAttributes()
      node = dom(node).unwrap()
    return node

  value: (node) ->
    return undefined unless this.match(node)
    if @config.value
      return @config.value(node)
    if _.isString(@config.attribute)
      return node.getAttribute(@config.attribute) or undefined    # So "" does not get returned
    else if _.isString(@config.style)
      return node.style[@config.style] or undefined
    else if _.isString(@config.class)
      for c in dom(node).classes()
        return c.slice(@config.class.length) if c.indexOf(@config.class) == 0
    else if _.isString(@config.tag)
      return true
    return undefined


module.exports = Format
