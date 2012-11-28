ScribeUtils =
  canModify: (node) ->
    return !node.classList.contains(Scribe.Constants.SPECIAL_CLASSES.ATOMIC) && !node.classList.contains(Scribe.Constants.SPECIAL_CLASSES.EXTERNAL)

  canRemove: (node) ->
    return !node.classList.contains(Scribe.Constants.SPECIAL_CLASSES.EXTERNAL)

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

  createContainerForAttribute: (doc, attribute, value) ->
    switch (attribute)
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
        span.classList.add("#{attribute}-#{value}")
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

  extractNodes: (startLineNode, startOffset, endLineNode, endOffset) ->
    [leftStart, rightStart] = Scribe.Utils.splitNode(startLineNode, startOffset, true)
    if startLineNode == endLineNode
      endLineNode = rightStart
      endOffset -= startOffset if leftStart? && startLineNode != rightStart
    [leftEnd, rightEnd] = Scribe.Utils.splitNode(endLineNode, endOffset, true)
    fragment = startLineNode.ownerDocument.createDocumentFragment()
    while rightStart != rightEnd
      next = rightStart.nextSibling
      fragment.appendChild(rightStart)
      rightStart = next
    Scribe.Utils.moveExternal(fragment, leftStart, null)
    Scribe.Utils.mergeNodes(leftStart, rightEnd)
    return fragment

  findAncestor: (node, checkFn) ->
    while node? && !checkFn(node)
      node = node.parentNode
    return node

  getAttributeDefault: (attribute) ->
    if Scribe.Constants.DEFAULT_LEAF_ATTRIBUTES[attribute]?
      return Scribe.Constants.DEFAULT_LEAF_ATTRIBUTES[attribute]
    else
      return false

  getAttributeForContainer: (container) ->
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
        if indent > 0
          return ['indent', indent]
        else
          return []
      when 'SPAN'
        attribute = []
        _.any(container.classList, (css) ->
          parts = css.split('-')
          if parts.length > 1
            key = parts[0]
            value = parts.slice(1).join('-')
            if Scribe.Constants.SPAN_ATTRIBUTES[key]?
              attribute = [key, value]
              return true
          return false
        )
        return attribute
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
    return _.indexOf(Scribe.Constants.BLOCK_TAGS, node.tagName) > -1

  isTextNodeParent: (node) ->
    return node.childNodes.length == 1 && node.firstChild.nodeType == node.TEXT_NODE

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

  mergeNodes: (node1, node2) ->
    return node2 if !node1?
    return node1 if !node2?
    this.moveChildren(node1, node2)
    node2.parentNode.removeChild(node2)
    if (node1.tagName == 'OL' || node1.tagName == 'UL') && node1.childNodes.length == 2
      ScribeUtils.mergeNodes(node1.firstChild, node1.lastChild)
    return node1

  moveChildren: (newParent, oldParent) ->
    _.each(_.clone(oldParent.childNodes), (child) ->
      newParent.appendChild(child)
    )

  moveExternal: (source, destParent, destRef) ->
    externalNodes = _.clone(source.querySelectorAll(".#{Scribe.Constants.SPECIAL_CLASSES.EXTERNAL}"))
    _.each(externalNodes, (node) ->
      destParent.insertBefore(node, destRef)
    )

  removeAttributeFromSubtree: (subtree, attribute) ->
    children = _.clone(subtree.childNodes)
    attributes = Scribe.Utils.getAttributeForContainer(subtree)
    [attrName, attrVal] = Scribe.Utils.getAttributeForContainer(subtree)
    ret = subtree
    if attrName == attribute
      ret = Scribe.Utils.unwrap(subtree)
    _.each(children, (child) ->
      Scribe.Utils.removeAttributeFromSubtree(child, attribute)
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

  splitNode: (node, offset, force = false) ->
    if offset > Scribe.Utils.getNodeLength(node)
      throw new Error('Splitting at offset greater than node length')

    if node.nodeType == node.TEXT_NODE
      node = this.wrap(node.ownerDocument.createElement('span'), node)

    # Check if split necessary
    if !force
      if offset == 0
        return [node.previousSibling, node, false]
      if offset == Scribe.Utils.getNodeLength(node)
        return [node, node.nextSibling, false]

    left = node
    right = node.cloneNode(false)
    node.parentNode.insertBefore(right, left.nextSibling)

    if ScribeUtils.isTextNodeParent(node)
      # Text split
      beforeText = node.textContent.substring(0, offset)
      afterText = node.textContent.substring(offset)
      left.textContent = beforeText
      right.textContent = afterText
      return [left, right, true]
    else
      # Node split
      [child, offset] = ScribeUtils.getChildAtOffset(node, offset)
      [childLeft, childRight] = ScribeUtils.splitNode(child, offset)
      while childRight != null
        nextRight = childRight.nextSibling
        right.appendChild(childRight)
        childRight = nextRight
      return [left, right, true]

  switchTag: (node, newTag) ->
    return if node.tagName == newTag
    newNode = node.ownerDocument.createElement(newTag)
    this.moveChildren(newNode, node)
    node.parentNode.replaceChild(newNode, node)
    newNode.className = node.className if node.className
    newNode.id = node.id if node.id
    return newNode

  traversePreorder: (root, offset, fn, context = fn, args...) ->
    return unless root?
    cur = root.firstChild
    while cur?
      nextOffset = offset + Scribe.Utils.getNodeLength(cur)
      curHtml = cur.innerHTML
      cur = fn.apply(context, [cur, offset].concat(args))
      ScribeUtils.traversePreorder.apply(ScribeUtils.traversePreorder, [cur, offset, fn, context].concat(args))
      if cur? && cur.innerHTML == curHtml
        cur = cur.nextSibling
        offset = nextOffset

  traverseSiblings: (startNode, endNode, fn) ->
    while startNode?
      nextSibling = startNode.nextSibling
      fn(startNode)
      break if startNode == endNode
      startNode = nextSibling

  unwrap: (node) ->
    next = node.firstChild
    _.each(_.clone(node.childNodes), (child) ->
      node.parentNode.insertBefore(child, node)
    )
    node.parentNode.removeChild(node)
    return next

  wrap: (wrapper, node) ->
    node.parentNode.insertBefore(wrapper, node)
    wrapper.appendChild(node)
    return wrapper

  wrapChildren: (wrapper, node) ->
    Scribe.Utils.moveChildren(wrapper, node)
    node.appendChild(wrapper)
    return wrapper



window.Scribe ||= {}
window.Scribe.Utils = ScribeUtils
