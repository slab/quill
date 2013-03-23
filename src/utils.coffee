Scribe = require('./scribe')


Scribe.Utils =
  cleanHtml: (html, keepIdClass = false) ->
    # Remove leading and tailing whitespace
    html = html.replace(/^\s\s*/, '').replace(/\s\s*$/, '')
    # Remove whitespace between tags
    html = html.replace(/>\s\s+</gi, '><')
    # Remove id or class classname
    html = html.replace(/\ (class|id)="[a-z0-9\-_]+"/gi, '') unless keepIdClass == true
    # Standardize br
    html = html.replace(/<br><\/br>/, '<br>')
    return html

  createContainerForFormat: (doc, name, value) ->
    switch (name)
      when 'bold'       then return doc.createElement('b')
      when 'italic'     then return doc.createElement('i')
      when 'strike'     then return doc.createElement('s')
      when 'underline'  then return doc.createElement('u')
      when 'link'
        link = doc.createElement('a')
        value = 'https://' + value unless value.match(/https?:\/\//)
        link.href = value
        link.href = 'about:blank' if (link.protocol != 'http:' && link.protocol != 'https:')
        link.title = link.href
        return link
      else
        span = doc.createElement('span')
        span.classList.add("#{name}-#{value}")
        return span

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

  getFormatDefault: (name) ->
    return Scribe.Constants.DEFAULT_LEAF_FORMATS[name] or false

  getFormatForContainer: (container) ->
    switch container.tagName
      when 'A'  then return ['link', container.getAttribute('href')]
      when 'B'  then return ['bold', true]
      when 'I'  then return ['italic', true]
      when 'S'  then return ['strike', true]
      when 'U'  then return ['underline', true]
      when 'OL' then return ['list', Scribe.Utils.getIndent(container)]
      when 'UL' then return ['bullet', Scribe.Utils.getIndent(container)]
      when 'DIV'
        indent = Scribe.Utils.getIndent(container)
        return if indent > 0 then ['indent', indent] else []
      when 'SPAN'
        format = []
        _.any(container.classList, (css) ->
          parts = css.split('-')
          if parts.length > 1
            key = parts[0]
            value = parts.slice(1).join('-')
            if Scribe.Constants.SPAN_FORMATS[key]?
              format = [key, value]
              return true
          return false
        )
        return format
      else
        return []
        
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
      if node.classList.contains(Scribe.Constants.SPECIAL_CLASSES.EXTERNAL)
        return 0
      externalNodes = node.querySelectorAll(".#{Scribe.Constants.SPECIAL_CLASSES.EXTERNAL}")
      length = _.reduce(externalNodes, (length, node) ->
        return length - node.textContent.length
      , node.textContent.length)
      return length + (if Scribe.Line.isLineNode(node) then 1 else 0)
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
    return _.indexOf(Scribe.Line.BLOCK_TAGS, node.tagName) > -1

  insertExternal: (position, extNode) ->
    if position.leafNode.lastChild?
      if position.leafNode.lastChild.nodeType == position.leafNode.TEXT_NODE
        position.leafNode.lastChild.splitText(position.offset)
        position.leafNode.insertBefore(extNode, position.leafNode.lastChild)
      else
        position.leafNode.parentNode.insertBefore(extNode, position.leafNode)
    else
      console.warn('offset is not 0', position.offset) if position.offset != 0
      position.leafNode.parentNode.insertBefore(extNode, position.leafNode)

  moveExternal: (source, destParent, destRef) ->
    externalNodes = _.clone(source.querySelectorAll(".#{Scribe.Constants.SPECIAL_CLASSES.EXTERNAL}"))
    _.each(externalNodes, (node) ->
      destParent.insertBefore(node, destRef)
    )

  removeFormatFromSubtree: (subtree, format) ->
    childNodes = Scribe.DOM.filterUneditable(subtree.childNodes)
    formats = Scribe.Utils.getFormatForContainer(subtree)
    [name, value] = Scribe.Utils.getFormatForContainer(subtree)
    ret = subtree
    if name == format
      ret = Scribe.DOM.unwrap(subtree)
    _.each(childNodes, (child) ->
      Scribe.Utils.removeFormatFromSubtree(child, format)
    )
    return ret

  removeExternal: (root) ->
    extNodes = _.clone(root.querySelectorAll(".#{Scribe.Constants.SPECIAL_CLASSES.EXTERNAL}"))
    _.each(extNodes, (node) ->
      node.parentNode.removeChild(node) if node.parentNode?
    )

  removeNode: (node) ->
    return unless node.parentNode?
    if Scribe.Line.isLineNode(node)
      prev = node.previousSibling
      next = node.nextSibling
      while true
        if Scribe.Line.isLineNode(prev)
          Scribe.Utils.moveExternal(node, prev, null)
          break
        else if Scribe.Line.isLineNode(next)
          Scribe.Utils.moveExternal(node, next, next.firstChild)
          break
        else if !prev? and !next?
          console.warn('External nodes might have no where to go!')
          Scribe.Utils.moveExternal(node, node.parentNode, node.nextSibling)
          break
        else
          prev = prev.previousSibling if prev?
          next = next.nextSibling if next?
    else
      Scribe.Utils.moveExternal(node, node.parentNode, node.nextSibling)
    node.parentNode.removeChild(node)

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
