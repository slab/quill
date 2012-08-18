#= require underscore

class TandemLeaf
  @groupByLine: (leaves) ->
    return _.reduce(leaves, (lines, leaf) ->
      if !lines[leaf.line.id]?
        lines[leaf.line.id] = []
      lines[leaf.line.id].push(leaf)
    , {})

  constructor: (@node) ->
    @length = @node.textContent.length




window.Tandem ||= {}
window.Tandem.Leaf = TandemLeaf
