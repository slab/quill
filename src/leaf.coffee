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


  constructor: (@line, @node, @attributes, @index) ->
    @length = @node.textContent.length

  getNextLeaf: ->
    return @line.leaves[@index + 1]

  getPrevLeaf: ->
    return @line.leaves[@index - 1]




window.Tandem ||= {}
window.Tandem.Leaf = TandemLeaf
