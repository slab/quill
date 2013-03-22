Scribe = require('./scribe')


Scribe.Normalizer =
  applyRules: (root) ->
    Scribe.DOM.traversePreorder(root, 0, (node, index) =>
      if node.nodeType == node.ELEMENT_NODE
        rules = Scribe.Constants.LINE_RULES[node.tagName]
        if rules?
          _.each(rules, (data, rule) ->
            switch rule
              when 'rename' then node = Scribe.DOM.switchTag(node, data)
              else return
          )
        else
          node = Scribe.DOM.unwrap(node)
      return node
    )

  breakBlocks: (root) ->
    this.groupBlocks(root)
    _.each(Scribe.DOM.filterUneditable(root.querySelectorAll(Scribe.Line.BREAK_TAGS.join(', '))), (node) ->
      node = Scribe.DOM.switchTag(node, 'br') if node.tagName != 'BR'
      Scribe.Normalizer.normalizeBreak(node, root)
    )
    _.each(Scribe.DOM.filterUneditable(root.querySelectorAll(Scribe.Line.BLOCK_TAGS.join(', '))), (node) ->
      node = Scribe.DOM.switchTag(node, 'div') if node.tagName != 'DIV'
    )
    _.each(Scribe.DOM.filterUneditable(root.childNodes), (childNode) ->
      Scribe.Normalizer.breakLine(childNode)
    )

  breakLine: (lineNode) ->
    return if lineNode.childNodes.length == 1 and lineNode.firstChild.tagName == 'BR'
    Scribe.DOM.traversePostorder(lineNode, (node) ->
      if Scribe.Utils.isBlock(node)
        node = Scribe.DOM.switchTag(node, 'div') if node.tagName != 'DIV'
        if node.nextSibling?
          line = lineNode.ownerDocument.createElement('div')
          lineNode.parentNode.insertBefore(line, lineNode.nextSibling)
          while node.nextSibling?
            line.appendChild(node.nextSibling)
          Scribe.Normalizer.breakLine(line)
        return Scribe.DOM.unwrap(node)
      else
        return node
    )

  groupBlocks: (root) ->
    curLine = root.firstChild
    while curLine?
      if Scribe.Utils.isBlock(curLine)
        curLine = curLine.nextSibling
      else
        line = root.ownerDocument.createElement('div')
        root.insertBefore(line, curLine)
        while curLine? and !Scribe.Utils.isBlock(curLine)
          nextLine = curLine.nextSibling
          line.appendChild(curLine)
          curLine = nextLine
        curLine = line

  mergeAdjacent: (root) ->
    Scribe.DOM.traversePreorder(root, 0, (node) ->
      if node.nodeType == node.ELEMENT_NODE and !Scribe.Line.isLineNode(node)
        next = node.nextSibling
        if next?.tagName == node.tagName and node.tagName != 'LI' and Scribe.DOM.canEdit(next)
          [nodeFormat, nodeValue] = Scribe.Utils.getFormatForContainer(node)
          [nextFormat, nextValue] = Scribe.Utils.getFormatForContainer(next)
          if nodeFormat == nextFormat && nodeValue == nextValue
            node = Scribe.DOM.mergeNodes(node, next)
      return node
    )

  normalizeBreak: (node, root) ->
    return if node == root
    if node.previousSibling?
      if node.nextSibling?
        Scribe.DOM.splitAfter(node, root)
      node.parentNode.removeChild(node)
    else if node.nextSibling?
      if Scribe.DOM.splitAfter(node, root)
        Scribe.Normalizer.normalizeBreak(node, root)
    else if node.parentNode != root and node.parentNode.parentNode != root
      # Make sure <div><br/></div> is not unintentionally unwrapped
      Scribe.DOM.unwrap(node.parentNode)
      Scribe.Normalizer.normalizeBreak(node, root)

  normalizeDoc: (root) ->
    root.appendChild(root.ownerDocument.createElement('div')) unless root.firstChild
    Scribe.Normalizer.breakBlocks(root)
    _.each(Scribe.DOM.filterUneditable(root.childNodes), (child) ->
      Scribe.Normalizer.normalizeLine(child)
      Scribe.Normalizer.optimizeLine(child)
    )

  normalizeLine: (lineNode) ->
    childNodes = Scribe.DOM.filterUneditable(lineNode.childNodes)
    return if childNodes.length == 1 and childNodes[0].tagName == 'BR'
    this.applyRules(lineNode)
    this.removeNoBreak(lineNode)
    this.normalizeSpan(lineNode)
    this.requireLeaf(lineNode)
    this.wrapText(lineNode)

  normalizeSpan: (lineNode) ->
    _.each(Scribe.DOM.filterUneditable(lineNode.querySelectorAll('span')), (node) ->
      # TODO convert styles to classes
      # TODO handle extraneous classes
      attributes = _.map(node.attributes, (attr) -> attr.name)
      _.each(attributes, (attrName) ->
        return if attrName == 'class'
        node.removeAttribute(attrName)
      )
    )

  optimizeLine: (lineNode) ->
    childNodes = Scribe.DOM.filterUneditable(lineNode.childNodes)
    return if childNodes.length == 1 and childNodes[0].tagName == 'BR'
    this.mergeAdjacent(lineNode)
    this.removeRedundant(lineNode)
    this.wrapText(lineNode)

  requireLeaf: (lineNode) ->
    unless Scribe.DOM.filterUneditable(lineNode.childNodes).length > 1
      if lineNode.tagName == 'OL' || lineNode.tagName == 'UL'
        lineNode.appendChild(lineNode.ownerDocument.createElement('li'))
        lineNode = lineNode.firstChild
      lineNode.appendChild(lineNode.ownerDocument.createElement('br'))

  removeNoBreak: (root) ->
    Scribe.DOM.traversePreorder(root, 0, (node) =>
      if node.nodeType == node.TEXT_NODE
        node.textContent = node.textContent.split(Scribe.Constants.NOBREAK_SPACE).join('')
      return node
    )

  removeRedundant: (lineNode) ->
    Key = _.uniqueId('_Formats')
    lineNode[Key] = {}
    isRedudant = (node) ->
      if node.nodeType == node.ELEMENT_NODE
        if Scribe.Utils.getNodeLength(node) == 0
          return node.tagName != 'BR' or Scribe.DOM.filterUneditable(node.parentNode.childNodes).length > 1
        [formatName, formatValue] = Scribe.Utils.getFormatForContainer(node)
        if formatName?
          return node.parentNode[Key][formatName]?     # Parent format value will overwrite child's so no need to check formatValue
        else if node.tagName == 'SPAN'
          # Check if childNodes need us
          childNodes = Scribe.DOM.filterUneditable(node.childNodes)
          if childNodes.length == 0 or !_.any(childNodes, (child) -> child.nodeType != child.ELEMENT_NODE)
            return true
          # Check if parent needs us
          if node.previousSibling == null && node.nextSibling == null and node.parentNode != lineNode and node.parentNode.tagName != 'LI'
            return true
      return false
    Scribe.DOM.traversePreorder(lineNode, 0, (node) =>
      if isRedudant(node)
        node = Scribe.DOM.unwrap(node)
      if node?
        node[Key] = _.clone(node.parentNode[Key])
        [formatName, formatValue] = Scribe.Utils.getFormatForContainer(node)
        node[Key][formatName] = formatValue if formatName?
      return node
    )
    delete lineNode[Key]
    Scribe.DOM.traversePreorder(lineNode, 0, (node) ->
      delete node[Key]
      return node
    )
    
  wrapText: (root) ->
    Scribe.DOM.traversePreorder(root, 0, (node) =>
      node.normalize()
      if node.nodeType == node.TEXT_NODE && (node.nextSibling? || node.previousSibling? || node.parentNode == root || node.parentNode.tagName == 'LI')
        span = node.ownerDocument.createElement('span')
        Scribe.DOM.wrap(span, node)
        node = span
      return node
    )


module.exports = Scribe
