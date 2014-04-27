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
  }

  # Make sure descendant break tags are not causing multiple lines to be rendered
  handleBreaks: (lineNode) ->
    breaks = _.map(lineNode.querySelectorAll(DOM.DEFAULT_BREAK_TAG))
    _.each(breaks, (br) =>
      Utils.splitAncestors(br.nextSibling, lineNode.parentNode) if br.nextSibling?
    )
    return lineNode

  normalizeLine: (lineNode) ->
    lineNode = Normalizer.wrapInline(lineNode)
    lineNode = Normalizer.handleBreaks(lineNode)
    Normalizer.pullBlocks(lineNode)
    Normalizer.wrapText(lineNode)
    return lineNode

  normalizeNode: (node) ->
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
      else
        attributes = DOM.getAttributes(node)
        if node.tagName == DOM.DEFAULT_INLNE_TAG
          # Remove unneeded SPANs
          if _.keys(attributes).length == 0 and (node.parentNode != lineNode or DOM.isElement(node.firstChild))
            nodes.push(node.nextSibling)
            DOM.unwrap(node)
            continue
        if node.previousSibling? and node.tagName == node.previousSibling.tagName
          # Merge similar nodes
          neighborAttributes = DOM.getAttributes(node.previousSibling)
          if _.isEqual(attributes, neighborAttributes)
            nodes.push(node.firstChild)
            DOM.moveChildren(node.previousSibling, node)
            DOM.normalize(node.previousSibling)
            DOM.removeNode(node)
    Normalizer.wrapText(lineNode)

  # Make sure descendants are all inline elements
  pullBlocks: (lineNode) ->
    curNode = lineNode.firstChild
    return unless curNode?
    if DOM.BLOCK_TAGS[curNode.tagName]?
      if curNode.nextSibling?
        Utils.splitAncestors(curNode.nextSibling, lineNode.parentNode)
      DOM.unwrap(curNode)
      Normalizer.pullBlocks(lineNode)
    curNode = curNode.nextSibling
    while curNode?
      if DOM.BLOCK_TAGS[curNode.tagName]?
        lineNode = Utils.splitAncestors(curNode, lineNode.parentNode)
        break
      curNode = curNode.nextSibling

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
    return unless DOM.isElement(node)
    node = DOM.switchTag(node, Normalizer.ALIASES[node.tagName]) if Normalizer.ALIASES[node.tagName]?
    if !Normalizer.TAGS[node.tagName]?
      tagName = if DOM.BLOCK_TAGS[node.tagName]? then DOM.DEFAULT_BLOCK_TAG else DOM.DEFAULT_INLNE_TAG
      node = DOM.switchTag(node, tagName)
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

  wrapText: (lineNode) ->
    texts = DOM.getTextNodes(lineNode)
    _.each(texts, (textNode) =>
      if textNode.previousSibling? or textNode.nextSibling? or textNode.parentNode == lineNode
        DOM.wrap(lineNode.ownerDocument.createElement(DOM.DEFAULT_INLNE_TAG), textNode)
    )


module.exports = Normalizer
