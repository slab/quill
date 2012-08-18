#= require underscore

class TandemLeaf
  @getAttribute: (node) ->
    switch node.tagName
      when 'B' then return ['bold', true]
      when 'I' then return ['italic', true]
      when 'S' then return ['strike', true]
      when 'U' then return ['underline', true]
      else          return [null, null]

  @groupByLine: (leaves) ->
    return _.reduce(leaves, (lines, leaf) ->
      if !lines[leaf.line.id]?
        lines[leaf.line.id] = []
      lines[leaf.line.id].push(leaf)
    , {})

  constructor: (@node, @attributes, @index) ->
    @length = @node.textContent.length




window.Tandem ||= {}
window.Tandem.Leaf = TandemLeaf
