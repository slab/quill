_           = require('lodash')
ScribeDOM   = require('./dom')
ScribeUtils = require('./utils')


ScribeDebug =
  checkDocumentConsistency: (doc) ->
    nodesByLine = _.map(_.clone(doc.root.childNodes), (lineNode) ->
      nodes = lineNode.querySelectorAll('*')
      return _.filter(nodes, (node) ->
        return node.nodeType == ScribeDOM.ELEMENT_NODE && (node.nodeName == 'BR' || !node.firstChild? || node.firstChild.nodeType == ScribeDOM.TEXT_NODE)
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
      _.each(doc.root.childNodes, (lineNode, index) ->
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
        calculatedLength = _.reduce(line.node.childNodes, ((length, node) -> ScribeUtils.getNodeLength(node) + length), 0)
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


module.exports = ScribeDebug
