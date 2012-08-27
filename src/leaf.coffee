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
    @text = @node.textContent
    @length = @text.length

  getNextLeaf: ->
    return @line.leaves[@index + 1]

  getPrevLeaf: ->
    return @line.leaves[@index - 1]

  setText: (@text) ->
    @node.textContent = @text




window.Tandem ||= {}
window.Tandem.Leaf = TandemLeaf
