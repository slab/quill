_   = require('lodash')
dom = require('../lib/dom')


camelize = (str) ->
  str = str.replace(/(?:^|[-_])(\w)/g, (i, c) ->
    return if c then c.toUpperCase() else ''
  )
  return str.charAt(0).toLowerCase() + str.slice(1)


class Normalizer
  @ALIASES: {
    'STRONG' : 'B'
    'EM'     : 'I'
    'DEL'    : 'S'
    'STRIKE' : 'S'
  }

  @ATTRIBUTES: {
    'color': 'color'
    'face' : 'fontFamily'
    'size' : 'fontSize'
  }

  constructor: ->
    @whitelist =
      styles: {}
      tags: {}
    @whitelist.tags[dom.DEFAULT_BREAK_TAG] = true
    @whitelist.tags[dom.DEFAULT_BLOCK_TAG] = true
    @whitelist.tags[dom.DEFAULT_INLINE_TAG] = true

  addFormat: (config) ->
    @whitelist.tags[config.tag] = true if config.tag?
    @whitelist.tags[config.parentTag] = true if config.parentTag?
    @whitelist.styles[config.style] = true if config.style?

  normalizeLine: (lineNode) ->
    lineNode = Normalizer.wrapInline(lineNode)
    lineNode = Normalizer.handleBreaks(lineNode)
    if lineNode.tagName == 'LI'
      Normalizer.flattenList(lineNode)
    lineNode = Normalizer.pullBlocks(lineNode)
    lineNode = this.normalizeNode(lineNode)
    Normalizer.unwrapText(lineNode)
    lineNode = lineNode.firstChild if lineNode? and dom.LIST_TAGS[lineNode.tagName]?
    return lineNode

  normalizeNode: (node) ->
    return node if dom(node).isTextNode()
    _.each(Normalizer.ATTRIBUTES, (style, attribute) ->
      if node.hasAttribute(attribute)
        value = node.getAttribute(attribute)
        value = dom.convertFontSize(value) if attribute == 'size'
        node.style[style] = value
        node.removeAttribute(attribute)
    )
    # Chrome turns <b> into style in some cases
    if (node.style.fontWeight == 'bold' or node.style.fontWeight > 500)
      node.style.fontWeight = ''
      dom(node).wrap(document.createElement('b'))
      node = node.parentNode
    this.whitelistStyles(node)
    return this.whitelistTags(node)

  whitelistStyles: (node) ->
    original = dom(node).styles()
    styles = _.omit(original, (value, key) =>
      return !@whitelist.styles[camelize(key)]?
    )
    if Object.keys(styles).length < Object.keys(original).length
      if Object.keys(styles).length > 0
        dom(node).styles(styles, true)
      else
        node.removeAttribute('style')

  whitelistTags: (node) ->
    return node unless dom(node).isElement()
    if Normalizer.ALIASES[node.tagName]?
      node = dom(node).switchTag(Normalizer.ALIASES[node.tagName]).get()
    else if !@whitelist.tags[node.tagName]?
      if dom.BLOCK_TAGS[node.tagName]?
        node = dom(node).switchTag(dom.DEFAULT_BLOCK_TAG).get()
      else if !node.hasAttributes() and node.firstChild?
        node = dom(node).unwrap()
      else
        node = dom(node).switchTag(dom.DEFAULT_INLINE_TAG).get()
    return node

  @flattenList: (listNode) ->
    ref = listNode.nextSibling
    innerItems = _.map(listNode.querySelectorAll('li'))
    innerItems.forEach((item) ->
      listNode.parentNode.insertBefore(item, ref)
      ref = item.nextSibling
    )
    innerLists = _.map(listNode.querySelectorAll(Object.keys(dom.LIST_TAGS).join(',')))
    innerLists.forEach((list) ->
      dom(list).remove()
    )

  # Make sure descendant break tags are not causing multiple lines to be rendered
  @handleBreaks: (lineNode) ->
    breaks = _.map(lineNode.querySelectorAll(dom.DEFAULT_BREAK_TAG))
    _.each(breaks, (br) =>
      if br.nextSibling? and (!dom.isIE(10) or br.previousSibling?)
        dom(br.nextSibling).splitBefore(lineNode.parentNode)
    )
    return lineNode

  # Removes unnecessary tags but does not modify line contents
  @optimizeLine: (lineNode) ->
    lineNode.normalize()
    lineNodeLength = dom(lineNode).length()
    nodes = dom(lineNode).descendants()
    while nodes.length > 0
      node = nodes.pop()
      continue unless node?.parentNode?
      continue if dom.EMBED_TAGS[node.tagName]?
      if node.tagName == dom.DEFAULT_BREAK_TAG
        # Remove unneeded BRs
        dom(node).remove() unless lineNodeLength == 0
      else if dom(node).length() == 0
        nodes.push(node.nextSibling)
        dom(node).unwrap()
      else if node.previousSibling? and node.tagName == node.previousSibling.tagName
        # Merge similar nodes
        if _.isEqual(dom(node).attributes(), dom(node.previousSibling).attributes())
          nodes.push(node.firstChild)
          dom(node.previousSibling).merge(node)

  # Make sure descendants are all inline elements
  @pullBlocks: (lineNode) ->
    curNode = lineNode.firstChild
    while curNode?
      if dom.BLOCK_TAGS[curNode.tagName]? and curNode.tagName != 'LI'
        dom(curNode).isolate(lineNode.parentNode)
        if !dom.LIST_TAGS[curNode.tagName]? or !curNode.firstChild
          dom(curNode).unwrap()
          Normalizer.pullBlocks(lineNode)
        else
          dom(curNode.parentNode).unwrap()
          lineNode = curNode unless lineNode.parentNode?    # May have just unwrapped lineNode
        break
      curNode = curNode.nextSibling
    return lineNode

  @stripComments: (html) ->
    return html.replace(/<!--[\s\S]*?-->/g, '')

  @stripWhitespace: (html) ->
    html = html.trim()
    # Replace all newline characters
    html = html.replace(/(\r?\n|\r)+/g, ' ')
    # Remove whitespace between tags, requires &nbsp; for legitmate spaces
    html = html.replace(/\>\s+\</g, '><')
    return html

  # Wrap inline nodes with block tags
  @wrapInline: (lineNode) ->
    return lineNode if dom.BLOCK_TAGS[lineNode.tagName]?
    blockNode = document.createElement(dom.DEFAULT_BLOCK_TAG)
    lineNode.parentNode.insertBefore(blockNode, lineNode)
    while lineNode? and !dom.BLOCK_TAGS[lineNode.tagName]?
      nextNode = lineNode.nextSibling
      blockNode.appendChild(lineNode)
      lineNode = nextNode
    return blockNode

  @unwrapText: (lineNode) ->
    spans = _.map(lineNode.querySelectorAll(dom.DEFAULT_INLINE_TAG))
    _.each(spans, (span) ->
      dom(span).unwrap() if (!span.hasAttributes())
    )


module.exports = Normalizer
