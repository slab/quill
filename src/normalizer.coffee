_     = require('lodash')
DOM   = require('./dom')
Utils = require('./utils')


class Normalizer
  @TAGS: {
    'DIV'
    'BR'
    'SPAN'
    'B'
    'I'
    'S'
    'U'
    'A'
    'IMG'
    'OL'
    'UL'
    'LI'
  }

  @STYLES: {
    'background-color'
    'color'
    'font-family'
    'font-size'
    'text-align'
  }

  @ALIASES: {
    'STRONG': 'B'
    'EM': 'I'
    'DEL': 'S'
    'STRIKE': 'S'
  }

  # Make sure descendant break tags are not causing multiple lines to be rendered
  @handleBreaks: (lineNode) ->
    breaks = _.map(lineNode.querySelectorAll('br'))
    _.each(breaks, (br) =>
      return if br == lineNode
      if br.previousSibling?
        if br.nextSibling?
          lineNode = Utils.splitAncestors(br, lineNode)
        br.parentNode.removeChild(br)
      else if br.nextSibling?
        lineNode = Utils.splitAncestors(br.nextSibling, lineNode)
    )
    return lineNode

  @normalizeLine: (lineNode) ->
    lineNode = Normalizer.wrapInline(lineNode)
    lineNode = Normalizer.handleBreaks(lineNode)
    lineNode = Normalizer.pullBlocks(lineNode)
    Normalizer.wrapText(lineNode)
    return lineNode

  @normalizeNode: (node) ->
    Normalizer.whitelistStyles(node)
    return Normalizer.whitelistTags(node)

  # Make sure descendants are all inline elements
  @pullBlocks: (lineNode) ->
    curNode = lineNode.firstChild
    return lineNode unless curNode?
    if DOM.BLOCK_TAGS[curNode.tagName]?
      if curNode.nextSibling?
        Utils.splitAncestors(curNode.nextSibling, lineNode)
      DOM.unwrap(curNode)
      return Normalizer.pullBlocks(lineNode)
    curNode = curNode.nextSibling
    while curNode?
      if DOM.BLOCK_TAGS[curNode.tagName]?
        lineNode = Utils.splitAncestors(curNode, lineNode)
        break
      curNode = curNode.nextSibling
    return lineNode

  @stripWhitespace: (html) ->
    # Remove leading and tailing whitespace
    html = html.replace(/^\s+/, '').replace(/\s+$/, '')
    # Remove whitespace between tags, requires &nbsp; for legitmate spaces
    html = html.replace(/\>\s+\</g, '><')
    return html

  @whitelistStyles: (node) ->
    original = DOM.getStyles(node)
    styles = _.pick(original, _.keys(Normalizer.STYLES))
    if _.keys(styles).length < _.keys(original).length
      if _.keys(styles).length > 0
        DOM.setStyles(node, styles)
      else
        node.removeAttribute('style')

  @whitelistTags: (node) ->
    return unless DOM.isElement(node)
    node = DOM.switchTag(node, Normalizer.ALIASES[node.tagName]) if Normalizer.ALIASES[node.tagName]
    if Normalizer.TAGS[node.tagName]?
      if DOM.VOID_TAGS[node.tagName]? and node.childNodes.length > 0
        replacement = node.cloneNode(false)
        node = node.parentNode.replaceChild(replacement, node)
    else
      tagName = if DOM.BLOCK_TAGS[node.tagName]? then 'div' else 'span'
      node = DOM.switchTag(node, tagName)
    return node

  # Wrap inline nodes with block tags
  @wrapInline: (lineNode) ->
    return lineNode if DOM.BLOCK_TAGS[lineNode.tagName]?
    blockNode = lineNode.ownerDocument.createElement('div')
    lineNode.parentNode.insertBefore(blockNode, lineNode)
    while lineNode? and !DOM.BLOCK_TAGS[lineNode.tagName]?
      nextNode = lineNode.nextSibling
      blockNode.appendChild(lineNode)
      lineNode = nextNode
    return blockNode

  @wrapText: (lineNode) ->
    texts = DOM.getTextNodes(lineNode)
    _.each(texts, (textNode) =>
      return unless textNode.parentNode?
      if textNode.previousSibling? or textNode.nextSibling?
        DOM.wrap(lineNode.ownerDocument.createElement('span'), textNode)
    )


module.exports = Normalizer
