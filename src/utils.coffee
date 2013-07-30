Scribe = require('./scribe')


Scribe.Utils =
  cleanHtml: (html, keepIdClass = false) ->
    html = Scribe.Normalizer.normalizeHtml(html)
    unless keepIdClass == true
      html = html.replace(/\ (class|id)="[a-z0-9\-_]+"/gi, '')
      html = html.replace(/\ (class|id)=[a-z0-9\-_]+ /gi, '')
      html = html.replace(/\ (class|id)=[a-z0-9\-_]+>/gi, '>')
    return html

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

  getNodeLength: (node) ->
    return 0 unless node?
    if node.nodeType == Scribe.DOM.ELEMENT_NODE
      return _.reduce(node.childNodes, (length, child) ->
        return length + Scribe.Utils.getNodeLength(child)
      , (if Scribe.Line.isLineNode(node) then 1 else 0))
    else if node.nodeType == Scribe.DOM.TEXT_NODE
      return Scribe.DOM.getText(node).length
    else
      return 0

  removeFormatFromSubtree: (subtree, format) ->
    if format.matchContainer(subtree)
      subtree = Scribe.DOM.unwrap(subtree)
    _.each(subtree.childNodes, (child) ->
      Scribe.Utils.removeFormatFromSubtree(child, format)
    )
    return subtree


module.exports = Scribe
