Scribe = require('./scribe')


Scribe.Utils =
  cleanHtml: (html, keepIdClass = false) ->
    html = Scribe.Normalizer.normalizeHtml(html)
    html = html.replace(/\ (class|id)="[a-z0-9\-_]+"/gi, '') unless keepIdClass == true
    return html

  createContainerForFormat: (doc, name, value) ->

  cloneAncestors: (node, limitingAncestor) ->
    clone = node.cloneNode(false)
    node = node.parentNode
    while node? and node != limitingAncestor
      parentClone = node.cloneNode(false)
      parentClone.appendChild(clone)
      clone = parentClone
      node = node.parentNode
    return clone

  findAncestor: (node, checkFn) ->
    while node? && !checkFn(node)
      node = node.parentNode
    return node
        
  getChildAtOffset: (node, offset) ->
    child = node.firstChild
    length = Scribe.Utils.getNodeLength(child)
    while child?
      break if offset < length
      offset -= length
      child = child.nextSibling
      length = Scribe.Utils.getNodeLength(child)
    unless child?
      child = node.lastChild
      offset = Scribe.Utils.getNodeLength(child)
    return [child, offset]

  getIndent: (list) ->
    indent = 0
    _.any(list.classList, (css) ->
      if css.substring(0, Scribe.Document.INDENT_PREFIX.length) == Scribe.Document.INDENT_PREFIX
        indent = parseInt(css.substring(Scribe.Document.INDENT_PREFIX.length))
        return true
      return false
    )
    return indent

  getNodeLength: (node) ->
    return 0 unless node?
    if node.nodeType == node.ELEMENT_NODE
      return _.reduce(node.childNodes, (length, child) ->
        return length + Scribe.Utils.getNodeLength(child)
      , (if Scribe.Line.isLineNode(node) then 1 else 0))
    else if node.nodeType == node.TEXT_NODE
      return node.textContent.length
    else
      return 0

  groupBlocks: (root) ->
    cur = root.firstChild
    lastNewBlock = null
    while cur?
      next = cur.nextSibling
      if Scribe.Utils.isBlock(cur)
        lastNewBlock = null if lastNewBlock?
      else
        unless lastNewBlock?
          lastNewBlock = root.ownerDocument.createElement('div')
          cur.parentNode.insertBefore(lastNewBlock, cur)
        lastNewBlock.appendChild(cur)
      cur = next

  isBlock: (node) ->
    return _.indexOf(Scribe.Normalizer.BLOCK_TAGS, node.tagName) > -1

  removeFormatFromSubtree: (renderer, subtree, format) ->
    if renderer.formats[format].matchContainer(subtree)
      subtree = Scribe.DOM.unwrap(subtree)
    _.each(subtree.childNodes, (child) ->
      Scribe.Utils.removeFormatFromSubtree(renderer, child, format)
    )
    return subtree

  removeNode: (node) ->
    node.parentNode?.removeChild(node)

  removeStyles: (root) ->
    walker = root.ownerDocument.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, null, false)
    walker.firstChild()
    walker.currentNode.removeAttribute('style')
    while walker.nextNode()
      walker.currentNode.removeAttribute('style')

  setIndent: (list, indent) ->
    _.each(_.clone(list.classList), (css) ->
      if css.substring(0, Scribe.Document.INDENT_PREFIX.length) == Scribe.Document.INDENT_PREFIX
        list.classList.remove(css)
    )
    list.classList.add(Scribe.Document.INDENT_PREFIX + indent) if indent


module.exports = Scribe
