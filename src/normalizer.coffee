_     = require('lodash')
DOM   = require('./dom')
Utils = require('./utils')


Normalizer =
  ALIASES: {
    'STRONG' : 'B'
    'EM'     : 'I'
    'DEL'    : 'S'
    'STRIKE' : 'S'
  }

  ATTRIBUTES: {
    'color': 'color'
    'face' : 'fontFamily'
    'size' : 'fontSize'
  }

  STYLES: {
    'background-color'
    'color'
    'font-family'
    'font-size'
    'text-align'
  }

  TAGS: {
    'DIV'
    'BR'
    'SPAN'
    'B'
    'I'
    'S'
    'U'
    'A'
    'IMG'
    'UL'
    'LI'
  }

  # Make sure descendant break tags are not causing multiple lines to be rendered
  handleBreaks: (lineNode) ->
    breaks = _.map(lineNode.querySelectorAll(DOM.DEFAULT_BREAK_TAG))
    _.each(breaks, (br) =>
      if br.nextSibling? and (!DOM.isIE(10) or br.previousSibling?)
        Utils.splitAncestors(br.nextSibling, lineNode.parentNode)
    )
    return lineNode

  normalizeLine: (lineNode) ->
    lineNode = Normalizer.wrapInline(lineNode)
    lineNode = Normalizer.handleBreaks(lineNode)
    lineNode = Normalizer.pullBlocks(lineNode)
    lineNode = Normalizer.normalizeNode(lineNode)
    Normalizer.unwrapText(lineNode)
    return lineNode

  normalizeNode: (node) ->
    return node if DOM.isTextNode(node)
    _.each(Normalizer.ATTRIBUTES, (style, attribute) ->
      if node.hasAttribute(attribute)
        value = node.getAttribute(attribute)
        value = Utils.convertFontSize(value) if attribute == 'size'
        node.style[style] = value
        node.removeAttribute(attribute)
    )
    Normalizer.whitelistStyles(node)
    return Normalizer.whitelistTags(node)

  # Removes unnecessary tags but does not modify line contents
  optimizeLine: (lineNode) ->
    lineNodeLength = Utils.getNodeLength(lineNode)
    nodes = DOM.getDescendants(lineNode)
    while nodes.length > 0
      node = nodes.pop()
      continue unless node?.parentNode?
      continue if DOM.EMBED_TAGS[node.tagName]?
      if node.tagName == DOM.DEFAULT_BREAK_TAG
        # Remove unneeded BRs
        DOM.removeNode(node) unless lineNodeLength == 0
      else if Utils.getNodeLength(node) == 0
        nodes.push(node.nextSibling)
        DOM.unwrap(node)
      else if node.previousSibling? and node.tagName == node.previousSibling.tagName
        # Merge similar nodes
        if _.isEqual(DOM.getAttributes(node), DOM.getAttributes(node.previousSibling))
          nodes.push(node.firstChild)
          Utils.mergeNodes(node.previousSibling, node)

  # Make sure descendants are all inline elements
  pullBlocks: (lineNode) ->
    curNode = lineNode.firstChild
    while curNode?
      if DOM.BLOCK_TAGS[curNode.tagName]? and curNode.tagName != 'LI'
        if curNode.previousSibling?
          Utils.splitAncestors(curNode, lineNode.parentNode)
        if curNode.nextSibling?
          Utils.splitAncestors(curNode.nextSibling, lineNode.parentNode)
        if !DOM.LIST_TAGS[curNode.tagName]?
          DOM.unwrap(curNode)
          Normalizer.pullBlocks(lineNode)
        else
          DOM.unwrap(curNode.parentNode)
          lineNode = curNode unless lineNode.parentNode?    # May have just unwrapped lineNode
        break
      curNode = curNode.nextSibling
    return lineNode

  stripComments: (html) ->
    return html.replace(/<!--[\s\S]*?-->/g, '')

  stripWhitespace: (html) ->
    # Remove leading and tailing whitespace
    html = html.replace(/^\s+/, '').replace(/\s+$/, '')
    # Remove whitespace between tags, requires &nbsp; for legitmate spaces
    html = html.replace(/\>\s+\</g, '><')
    return html

  whitelistStyles: (node) ->
    original = DOM.getStyles(node)
    styles = _.omit(original, (value, key) ->
      return !Normalizer.STYLES[key]?
    )
    if _.keys(styles).length < _.keys(original).length
      if _.keys(styles).length > 0
        DOM.setStyles(node, styles)
      else
        node.removeAttribute('style')

  whitelistTags: (node) ->
    return node unless DOM.isElement(node)
    node = DOM.switchTag(node, Normalizer.ALIASES[node.tagName]) if Normalizer.ALIASES[node.tagName]?
    if !Normalizer.TAGS[node.tagName]?
      if DOM.BLOCK_TAGS[node.tagName]?
        node = DOM.switchTag(node, DOM.DEFAULT_BLOCK_TAG)
      else if !node.hasAttributes() and node.firstChild?
        node = DOM.unwrap(node)
      else
        node = DOM.switchTag(node, DOM.DEFAULT_INLINE_TAG)
    return node

  # Wrap inline nodes with block tags
  wrapInline: (lineNode) ->
    return lineNode if DOM.BLOCK_TAGS[lineNode.tagName]?
    blockNode = lineNode.ownerDocument.createElement(DOM.DEFAULT_BLOCK_TAG)
    lineNode.parentNode.insertBefore(blockNode, lineNode)
    while lineNode? and !DOM.BLOCK_TAGS[lineNode.tagName]?
      nextNode = lineNode.nextSibling
      blockNode.appendChild(lineNode)
      lineNode = nextNode
    return blockNode

  unwrapText: (lineNode) ->
    spans = _.map(lineNode.querySelectorAll(DOM.DEFAULT_INLINE_TAG))
    _.each(spans, (span) ->
      attributes = DOM.getAttributes(span)
      if _.keys(attributes).length == 0
        DOM.unwrap(span)
    )


module.exports = Normalizer
