_           = require('lodash')
ScribeDOM   = require('./dom')
ScribeUtils = require('./utils')


class ScribeNormalizer
  # Missing tag rule implies removal, ex. SCRIPT is missing from list
  @TAG_RULES:
    'A'         : {}
    'ADDRESSS'  : {rename: 'div'}
    'B'         : {}
    'BLOCKQUOTE': {rename: 'div'}
    'BR'        : {}
    'BIG'       : {rename: 'span'}
    'CENTER'    : {rename: 'span'}
    'DD'        : {rename: 'div'}
    'DEL'       : {rename: 's'}
    'DIV'       : {}
    'DL'        : {rename: 'div'}
    'EM'        : {rename: 'i'}
    'FONT'      : (formatManager, node) ->
      resultNode = ScribeDOM.unwrap(node)
      _.each({ color: 'fore-color', face: 'font-name', size: 'font-size' }, (format, attr) ->
        if node.hasAttribute(attr)
          formatNode = formatManager.createFormatContainer(format, node.getAttribute(attr))
          resultNode = ScribeDOM.wrap(formatNode, resultNode)
      )
      return resultNode
    'H1'        : {rename: 'div'}
    'H2'        : {rename: 'div'}
    'H3'        : {rename: 'div'}
    'H4'        : {rename: 'div'}
    'H5'        : {rename: 'div'}
    'H6'        : {rename: 'div'}
    'HR'        : {rename: 'br'}
    'I'         : {}
    'INS'       : {rename: 'span'}
    'LI'        : {rename: 'div'}
    'OL'        : {rename: 'div'}
    'P'         : {rename: 'div'}
    'PRE'       : {rename: 'div'}
    'S'         : {}
    'SMALL'     : {rename: 'span'}
    'SPAN'      : {}
    'STRIKE'    : {rename: 's'}
    'STRONG'    : {rename: 'b'}
    'TABLE'     : {rename: 'div'}
    'TBODY'     : {rename: 'div'}
    'TD'        : {rename: 'span'}
    'TFOOT'     : {rename: 'div'}
    'TH'        : {rename: 'span'}
    'THEAD'     : {rename: 'div'}
    'TR'        : {rename: 'div'}
    'U'         : {}
    'UL'        : {rename: 'div'}

  @breakBlocks: (root) ->
    ScribeNormalizer.groupBlocks(root)
    _.each(_.clone(root.querySelectorAll('br')), ScribeNormalizer.normalizeBreak.bind('this', root))
    _.each(ScribeDOM.getChildNodes(root), ScribeNormalizer.breakLine.bind(this))

  @breakLine: (lineNode) ->
    return if lineNode.childNodes.length == 1 and lineNode.firstChild.tagName == 'BR'
    ScribeUtils.traversePostorder(lineNode, (node) =>
      if ScribeUtils.isBlock(node)
        node = ScribeDOM.switchTag(node, 'div') if node.tagName != 'DIV'
        if node.nextSibling?
          line = lineNode.ownerDocument.createElement('div')
          lineNode.parentNode.insertBefore(line, lineNode.nextSibling)
          while node.nextSibling?
            line.appendChild(node.nextSibling)
          ScribeNormalizer.breakLine(line)
        return ScribeDOM.unwrap(node)
      else
        return node
    )

  @groupBlocks: (root) ->
    curLine = root.firstChild
    while curLine?
      if ScribeUtils.isBlock(curLine)
        curLine = curLine.nextSibling
      else
        line = root.ownerDocument.createElement('div')
        root.insertBefore(line, curLine)
        while curLine? and !ScribeUtils.isBlock(curLine)
          nextLine = curLine.nextSibling
          line.appendChild(curLine)
          curLine = nextLine
        curLine = line

  @normalizeBreak: (root, node) ->
    return if node == root
    if node.previousSibling?
      if node.nextSibling?
        ScribeUtils.splitBefore(node, root)
      node.parentNode.removeChild(node)
    else if node.nextSibling?
      if ScribeUtils.splitBefore(node.nextSibling, root)
        ScribeNormalizer.normalizeBreak(root, node)
    else if node.parentNode != root and node.parentNode.parentNode != root
      # Make sure <div><br/></div> is not unintentionally unwrapped
      ScribeDOM.unwrap(node.parentNode)
      ScribeNormalizer.normalizeBreak(root, node)

  @normalizeEmptyLines: (root) ->
    return unless ScribeUtils.isIE()
    _.each(root.querySelectorAll('br'), (node) ->
      # See IE's newline section in doc/browser-quirks
      ScribeDOM.removeNode(node) if node.previousSibling? or node.nextSibling?
    )

  @normalizeHtml: (html) ->
    # Remove leading and tailing whitespace
    html = html.replace(/^\s+/, '').replace(/\s+$/, '')
    # Remove whitespace between tags
    html = html.replace(/\>\s+\</g, '><')
    # Standardize br
    html = html.replace(/<br><\/br>/, '<br/>')
    return html

  @requireLeaf: (lineNode) ->
    if lineNode.childNodes.length == 0
      tagName = if (lineNode.previousSibling? or lineNode.nextSibling?) then 'br' else 'span'
      lineNode.appendChild(lineNode.ownerDocument.createElement(tagName))

  @wrapText: (lineNode) ->
    ScribeUtils.traversePreorder(lineNode, 0, (node) =>
      ScribeDOM.normalize(node)
      if node.nodeType == ScribeDOM.TEXT_NODE && (node.nextSibling? || node.previousSibling? || node.parentNode == lineNode or node.parentNode.tagName == 'LI')
        span = node.ownerDocument.createElement('span')
        ScribeDOM.wrap(span, node)
        node = span
      return node
    )


  constructor: (@container, @formatManager) ->

  applyRules: (root) ->
    ScribeUtils.traversePreorder(root, 0, (node, index) =>
      if node.nodeType == ScribeDOM.ELEMENT_NODE
        rules = ScribeNormalizer.TAG_RULES[node.tagName]
        if rules?
          if _.isFunction(rules)
            node = rules.call(null, @formatManager, node)
          else if _.isObject(rules)
            _.each(rules, (data, rule) ->
              switch rule
                when 'rename' then node = ScribeDOM.switchTag(node, data)
                else return
            )
        else
          node = ScribeDOM.unwrap(node)
      return node
    )

  normalizeDoc: ->
    this.applyRules(@container)
    ScribeNormalizer.breakBlocks(@container)
    @container.appendChild(@container.ownerDocument.createElement('div')) if @container.childNodes.length == 0
    _.each(ScribeDOM.getChildNodes(@container), (lineNode) =>
      this.normalizeLine(lineNode)
    )

  normalizeLine: (lineNode) ->
    return if lineNode.childNodes.length == 1 and lineNode.firstChild.tagName == 'BR'
    this.applyRules(lineNode)
    this.normalizeTags(lineNode)
    this.removeRedundant(lineNode)
    ScribeNormalizer.requireLeaf(lineNode)
    ScribeNormalizer.wrapText(lineNode)

  normalizeTags: (lineNode) ->
    ScribeUtils.traversePreorder(lineNode, 0, (node) =>
      containerNode = node
      [nodeFormat, nodeValue] = @formatManager.getFormat(node)
      if _.isArray(nodeFormat)
        _.each(nodeFormat.slice(1), (format, i) =>
          if @formatManager.formats[format]?
            container = @formatManager.formats[format].createContainer(nodeValue[i+1])
            containerNode = ScribeDOM.wrap(container, node)
        )
        nodeFormat = nodeFormat[0]
        nodeValue = nodeValue[0]
      if @formatManager.formats[nodeFormat]?
        @formatManager.formats[nodeFormat].clean(node)
      else
        ScribeDOM.removeAttributes(node)
      return containerNode
    )

  removeRedundant: (lineNode) ->
    nodes = [lineNode]
    attributes = [{}]
    ScribeUtils.traversePreorder(lineNode, 0, (node) =>
      [formatName, formatValue] = @formatManager.getFormat(node)
      parentAttributes = attributes[_.indexOf(nodes, node.parentNode)]
      redundant = do (node) =>
        return false unless node.nodeType == ScribeDOM.ELEMENT_NODE
        if ScribeUtils.getNodeLength(node) == 0
          return false if node.tagName == 'BR' and !node.previousSibling? and !node.nextSibling?
          return false if node.tagName == 'SPAN' and node.parentNode == lineNode and !lineNode.parentNode.childNodes.length == 0 and lineNode.childNodes.length == 0
          return true
        # Parent format value will overwrite child's so no need to check formatValue
        return parentAttributes[formatName]? if formatName?
        return false unless node.tagName == 'SPAN'
        # Check if childNodes need us
        return true if node.childNodes.length == 0 or !_.any(ScribeDOM.getChildNodes(node), (child) -> child.nodeType != ScribeDOM.ELEMENT_NODE)
        # Check if parent needs us
        return true if node.previousSibling == null and node.nextSibling == null and node.parentNode != lineNode and node.parentNode.tagName != 'LI'
        return false
      if redundant
        node = ScribeDOM.unwrap(node)
      if node?
        nodes.push(node)
        if formatName?
          nodeAttributes = _.clone(parentAttributes)
          nodeAttributes[formatName] = formatValue
          attributes.push(nodeAttributes)
        else
          attributes.push(parentAttributes)
      return node
    )


module.exports = ScribeNormalizer
