# Inject fixtures into DOM
$(document.body).prepend(_.map(window.__html__, (html) ->
  return html
).join(''))


expect.consistent = (doc) ->
  nodesByLine = _.map(Scribe.DOM.getChildNodes(doc.root), (lineNode) ->
    nodes = lineNode.querySelectorAll('*')
    return _.filter(nodes, (node) ->
      return node.nodeType == Scribe.DOM.ELEMENT_NODE && (node.nodeName == 'BR' || !node.firstChild? || node.firstChild.nodeType == Scribe.DOM.TEXT_NODE)
    )
  )
  lines = doc.lines.toArray()

  try
    # doc.lines and doc.lineMap should match
    if lines.length != _.values(doc.lineMap).length
      throw new Error("doc.lines and doc.lineMap differ in length")
    _.each(lines, (line) =>
      if !line? || doc.lineMap[line.id] != line
        if line?
          throw new Error("Line does not match lineMap")
        else
          throw new Error("Null line")
    )
    # Line nodes and line's nodes should match
    _.each(Scribe.DOM.getChildNodes(doc.root), (lineNode, index) ->
      if lines[index].node != lineNode
        throw new Error("Line and nodes do not match")
    )
    # All lines should still be in the DOM
    _.each(lines, (line) ->
      if line.node.parentNode == null
        throw new Error('Missing line from DOM')
    )
    # All leaves should still be in the DOM
    _.each(lines, (line) ->
      _.each(line.leaves.toArray(), (leaf) ->
        if leaf.node.parentNode == null
          throw new Error('Missing leaf from DOM')
      )
    )
    # All line lengths should be correct
    _.each(lines, (line) ->
      lineLength = _.reduce(line.leaves.toArray(), (count, leaf) ->
        return leaf.length + count
      , 0)
      if lineLength != line.length
        throw new Error('Incorrect line length')
    )
    # doc.lines should match nodesByLine
    if lines.length != nodesByLine.length
      throw new Error("doc.lines and nodesByLine differ in length")
    _.each(lines, (line, index) =>
      calculatedLength = _.reduce(Scribe.DOM.getChildNodes(line.node), ((length, node) -> Scribe.Utils.getNodeLength(node) + length), 0)
      if line.length != calculatedLength
        throw new Error('Line length inccorect')
      leaves = line.leaves.toArray()
      leafNodes = _.map(leaves, (leaf) -> return leaf.node)
      if !_.isEqual(leafNodes, nodesByLine[index])
        throw new Error("Nodes differ from leaves")
      leaves = _.map(leaves, (leaf) ->
        return _.pick(leaf, 'formats', 'length', 'line', 'node', 'text')
      )
      line.rebuild(true)
      rebuiltLeaves = _.map(line.leaves.toArray(), (leaf) ->
        return _.pick(leaf, 'formats', 'length', 'line', 'node', 'text')
      )
      if !_.isEqual(leaves, rebuiltLeaves)
        throw new Error("Leaves differ from rebuilt")
    )
  catch e
    e.doc = doc
    e.nodes = nodesByLine
    e.lines = lines
    throw e
    return false
  return true

expect.equalDeltas = (delta1, delta2) ->
  return false

expect.equalHtml = (html1, html2) ->
  [html1, html2] = _.map([html1, html2], (html) ->
    html = html.join('') if _.isArray(html)
    html = html.innerHTML unless _.isString(html)
    html = Scribe.Normalizer.normalizeHtml(html)
    html = html.replace(/[\'\";]/g, '')    # IE8 outerHTML does not have quotes
    html = html.replace(/rgb\((\d+), ?(\d+), ?(\d+)\)/g, "rgb($1, $2, $3)") # IE8 removes spaces between digits
    html = html.toLowerCase()              # IE8 uppercases their tags
    return html
  )
  expect(html1).to.equal(html2)
