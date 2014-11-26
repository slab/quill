_   = require('lodash')
dom = require('./dom')


class Normalizer
  @ATTRIBUTES: {
    'color': 'color'
    'face' : 'fontFamily'
    'size' : 'fontSize'
  }

  @stripComments: (html) ->
    return html.replace(/<!--[\s\S]*?-->/g, '')

  @stripWhitespace: (html) ->
    html = html.trim()
    # Replace all newline characters
    html = html.replace(/(\r?\n|\r)+/g, ' ')
    # Remove whitespace between tags, requires &nbsp; for legitmate spaces
    html = html.replace(/\>\s+\</g, '><')
    return html


  constructor: () ->
    @aliases = {}
    @styles = {}
    @tags = {}
    @tags[dom.DEFAULT_BREAK_TAG] = true
    @tags[dom.DEFAULT_BLOCK_TAG] = true
    @tags[dom.DEFAULT_INLINE_TAG] = true

  addFormat: (config) ->
    @tags[config.tag] = true if config.tag?
    @tags[config.parentTag] = true if config.parentTag?
    @styles[config.style] = true if config.style?
    _.each(config.aliasTags, (alias) =>
      @aliases[alias] = config.tag
    ) if config.aliasTags? and config.tag?

  normalizeLine: (lineNode) ->
    lineNode = this._wrapInline(lineNode)
    lineNode = this._handleBreaks(lineNode)
    lineNode = this._pullBlocks(lineNode)
    lineNode = this.normalizeNode(lineNode)
    this._unwrapText(lineNode)
    if lineNode? and dom.LIST_TAGS[lineNode.tagName]?
      lineNode = lineNode.firstChild
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
    this._whitelistStyles(node)
    return this._whitelistTags(node)

  # Removes unnecessary tags but does not modify line contents
  optimizeLine: (lineNode) ->
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

  # Make sure descendant break tags are not causing multiple lines to be rendered
  _handleBreaks: (lineNode) ->
    breaks = _.map(lineNode.querySelectorAll(dom.DEFAULT_BREAK_TAG))
    _.each(breaks, (br) =>
      if br.nextSibling? and (!dom.isIE(10) or br.previousSibling?)
        dom(br.nextSibling).splitAncestors(lineNode.parentNode)
    )
    return lineNode

  # Make sure descendants are all inline elements
  _pullBlocks: (lineNode) ->
    curNode = lineNode.firstChild
    while curNode?
      if dom.BLOCK_TAGS[curNode.tagName]? and curNode.tagName != 'LI'
        if curNode.previousSibling?
          dom(curNode).splitAncestors(lineNode.parentNode)
        if curNode.nextSibling?
          dom(curNode.nextSibling).splitAncestors(lineNode.parentNode)
        if !dom.LIST_TAGS[curNode.tagName]? or !curNode.firstChild
          dom(curNode).unwrap()
          this._pullBlocks(lineNode)
        else
          dom(curNode.parentNode).unwrap()
          lineNode = curNode unless lineNode.parentNode?    # May have just unwrapped lineNode
        break
      curNode = curNode.nextSibling
    return lineNode

  _whitelistStyles: (node) ->
    original = dom(node).styles()
    styles = _.omit(original, (value, key) =>
      # Convert to camelCase
      key = key.replace(/-(.)/g, (match, c) -> c.toUpperCase());
      return !@styles[key]?
    )
    if Object.keys(styles).length < Object.keys(original).length
      if Object.keys(styles).length > 0
        dom(node).styles(styles, true)
      else
        node.removeAttribute('style')

  _whitelistTags: (node) ->
    return node unless dom(node).isElement()
    if @aliases[node.tagName]?
      node = dom(node).switchTag(@aliases[node.tagName])
    else if !@tags[node.tagName]?
      if dom.BLOCK_TAGS[node.tagName]?
        node = dom(node).switchTag(dom.DEFAULT_BLOCK_TAG)
      else if !node.hasAttributes() and node.firstChild?
        node = dom(node).unwrap()
      else
        node = dom(node).switchTag(dom.DEFAULT_INLINE_TAG)
    return node

  # Wrap inline nodes with block tags
  _wrapInline: (lineNode) ->
    return lineNode if dom.BLOCK_TAGS[lineNode.tagName]?
    blockNode = document.createElement(dom.DEFAULT_BLOCK_TAG)
    lineNode.parentNode.insertBefore(blockNode, lineNode)
    while lineNode? and !dom.BLOCK_TAGS[lineNode.tagName]?
      nextNode = lineNode.nextSibling
      blockNode.appendChild(lineNode)
      lineNode = nextNode
    return blockNode

  _unwrapText: (lineNode) ->
    spans = _.map(lineNode.querySelectorAll(dom.DEFAULT_INLINE_TAG))
    _.each(spans, (span) ->
      dom(span).unwrap() if (!span.hasAttributes())
    )


module.exports = Normalizer
