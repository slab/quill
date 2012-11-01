#= underscore
#= tandem/constants

TandemUtils = 
  # All block nodes inside nodes are moved out
  breakBlocks: (root) ->
    lineNodes = [root]
    this.traversePreorder(root, 0, (node, index) =>
      if node.nodeType == node.ELEMENT_NODE && Tandem.Utils.canModify(node)
        toBreak = []
        if _.indexOf(Tandem.Constants.BLOCK_TAGS, node.tagName, true) > -1
          [left1, left2, didLeftSplit] = this.splitNode(root, index)
          if didLeftSplit
            toBreak = toBreak.concat([left1, left2])
          else
            [right1, right2, didRightSplit] = this.splitNode(root, Tandem.Utils.getNodeLength(node))
            toBreak = toBreak.concat([right1, right2]) if didRightSplit
        else if _.indexOf(Tandem.Constants.BREAK_TAGS, node.tagName, true) > -1
          next = node.nextSibling
          if node.previousSibling && node.nextSibling
            [left, right, didSplit] = this.splitNode(root, index, true)
            node.parentNode.removeChild(node)
            toBreak = [left, right]
            node = next
          else if node.previousSibling || node.nextSibling
            node.parentNode.removeChild(node)
            node = next
        _.each(toBreak, (line) =>
          if line? && line != root
            newLineNodes = this.breakBlocks(line)
            lineNodes.push(line)
            lineNodes = _.uniq(lineNodes.concat(newLineNodes))
        )
      return node
    )
    return lineNodes

  canModify: (node) ->
    return !node.classList.contains(Tandem.Constants.SPECIAL_CLASSES.ATOMIC) && !node.classList.contains(Tandem.Constants.SPECIAL_CLASSES.EXTERNAL)

  canRemove: (node) ->
    return !node.classList.contains(Tandem.Constants.SPECIAL_CLASSES.EXTERNAL)

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
        link.href = value
        link.addEventListener('click', (e) ->
          if link.href != 'about:blank'
            window.open(link.href)
            e.preventDefault()
        )
        link.href = 'about:blank' if (link.protocol != 'http:' && link.protocol != 'https:')
        link.title = link.href
        return link
      else
        span = doc.createElement('span')
        span.classList.add(attribute)
        span.classList.add(value)
        return span

  extractNodes: (startLineNode, startOffset, endLineNode, endOffset) ->
    [leftStart, rightStart] = Tandem.Utils.splitNode(startLineNode, startOffset, true)
    if startLineNode == endLineNode
      endLineNode = rightStart
      endOffset -= startOffset if leftStart? && startLineNode != rightStart
    [leftEnd, rightEnd] = Tandem.Utils.splitNode(endLineNode, endOffset, true)
    fragment = startLineNode.ownerDocument.createDocumentFragment()
    while rightStart != rightEnd
      next = rightStart.nextSibling
      fragment.appendChild(rightStart)
      rightStart = next
    externalNodes = _.clone(fragment.querySelectorAll(".#{Tandem.Constants.SPECIAL_CLASSES.EXTERNAL}"))
    _.each(externalNodes, (node) ->
      leftStart.appendChild(node)
    )
    Tandem.Utils.mergeNodes(leftStart, rightEnd)
    return fragment

  findAncestor: (node, checkFn) ->
    while node? && !checkFn(node)
      node = node.parentNode
    return node

  getAttributeDefault: (attribute) ->
    switch attribute
      when 'font-background'  then return 'white'
      when 'font-color'       then return 'black'
      when 'font-family'      then return 'san-serif'
      when 'font-size'        then return 'normal'
      else                         return false

  getAttributeForContainer: (container) ->
    switch container.tagName
      when 'A'  then return ['link', container.getAttribute('href')]
      when 'B'  then return ['bold', true]
      when 'I'  then return ['italic', true]
      when 'S'  then return ['strike', true]
      when 'U'  then return ['underline', true]
      when 'OL' then return ['list', Tandem.Utils.getIndent(container)]
      when 'UL' then return ['bullet', Tandem.Utils.getIndent(container)]
      when 'DIV'
        indent = Tandem.Utils.getIndent(container)
        if indent > 0
          return ['indent', indent]
        else
          return []
      when 'SPAN'
        attribute = []
        _.all(Tandem.Constants.SPAN_ATTRIBUTES, (list, attrName) ->
          if container.classList.contains(attrName)
            return _.all(container.classList, (css) ->
              if _.indexOf(list, css) > -1
                attribute = [attrName, css]
                return false
              return true
            )
          return true
        )
        return attribute
      else
        return []
        
  getChildAtOffset: (node, offset) ->
    child = node.firstChild
    length = Tandem.Utils.getNodeLength(child)
    while child?
      break if offset < length
      offset -= length
      child = child.nextSibling
      length = Tandem.Utils.getNodeLength(child)
    unless child?
      child = node.lastChild
      offset = Tandem.Utils.getNodeLength(child)
    return [child, offset]

  getIndent: (list) ->
    indent = 0
    _.any(list.classList, (css) ->
      if css.substring(0, Tandem.Document.INDENT_PREFIX.length) == Tandem.Document.INDENT_PREFIX
        indent = parseInt(css.substring(Tandem.Document.INDENT_PREFIX.length))
        return true
      return false
    )
    return indent

  getNodeLength: (node) ->
    return 0 unless node?
    if node.nodeType == node.ELEMENT_NODE
      if node.classList.contains(Tandem.Constants.SPECIAL_CLASSES.EXTERNAL)
        return 0
      externalNodes = node.querySelectorAll(".#{Tandem.Constants.SPECIAL_CLASSES.EXTERNAL}")
      length = _.reduce(externalNodes, (length, node) ->
        return length - node.textContent.length
      , node.textContent.length)
      return length + (if Tandem.Line.isLineNode(node) then 1 else 0)
    else if node.nodeType == node.TEXT_NODE
      return node.textContent.length
    else
      return 0

  isTextNodeParent: (node) ->
    return node.childNodes.length == 1 && node.firstChild.nodeType == node.TEXT_NODE

  mergeNodes: (node1, node2) ->
    return node2 if !node1?
    return node1 if !node2?
    this.moveChildren(node1, node2)
    node2.parentNode.removeChild(node2)
    if (node1.tagName == 'OL' || node1.tagName == 'UL') && node1.childNodes.length == 2
      TandemUtils.mergeNodes(node1.firstChild, node1.lastChild)
    return node1

  moveChildren: (newParent, oldParent) ->
    _.each(_.clone(oldParent.childNodes), (child) ->
      newParent.appendChild(child)
    )

  removeAttributeFromSubtree: (subtree, attribute) ->
    children = _.clone(subtree.childNodes)
    attributes = Tandem.Utils.getAttributeForContainer(subtree)
    [attrName, attrVal] = Tandem.Utils.getAttributeForContainer(subtree)
    ret = subtree
    if attrName == attribute
      ret = Tandem.Utils.unwrap(subtree)
    _.each(children, (child) ->
      Tandem.Utils.removeAttributeFromSubtree(child, attribute)
    )
    return ret

  setIndent: (list, indent) ->
    _.each(_.clone(list.classList), (css) ->
      if css.substring(0, Tandem.Document.INDENT_PREFIX.length) == Tandem.Document.INDENT_PREFIX
        list.classList.remove(css)
    )
    list.classList.add(Tandem.Document.INDENT_PREFIX + indent) if indent

  splitNode: (node, offset, force = false) ->
    if offset > Tandem.Utils.getNodeLength(node)
      throw new Error('Splitting at offset greater than node length')

    if node.nodeType == node.TEXT_NODE
      node = this.wrap(node.ownerDocument.createElement('span'), node)

    # Check if split necessary
    if !force
      if offset == 0
        return [node.previousSibling, node, false]
      if offset == Tandem.Utils.getNodeLength(node)
        return [node, node.nextSibling, false]

    left = node
    right = node.cloneNode(false)
    node.parentNode.insertBefore(right, left.nextSibling)

    if TandemUtils.isTextNodeParent(node)
      # Text split
      beforeText = node.textContent.substring(0, offset)
      afterText = node.textContent.substring(offset)
      left.textContent = beforeText
      right.textContent = afterText
      return [left, right, true]
    else
      # Node split
      [child, offset] = TandemUtils.getChildAtOffset(node, offset)
      [childLeft, childRight] = TandemUtils.splitNode(child, offset)
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
      nextOffset = offset + Tandem.Utils.getNodeLength(cur)
      curHtml = cur.innerHTML
      cur = fn.apply(context, [cur, offset].concat(args))
      TandemUtils.traversePreorder.apply(TandemUtils.traversePreorder, [cur, offset, fn, context].concat(args))
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
    Tandem.Utils.moveChildren(wrapper, node)
    node.appendChild(wrapper)
    return wrapper



window.Tandem ||= {}
window.Tandem.Utils = TandemUtils
