#= underscore

TandemUtils = 
  Attribute:
    getTagName: (attribute) ->
      switch (attribute)
        when 'bold'       then return 'B'
        when 'italic'     then return 'I'
        when 'strike'     then return 'S'
        when 'underline'  then return 'U'
        else return 'SPAN'

  Node:
    createContainerForAttribute: (doc, attribute) ->
      switch (attribute)
        when 'bold'       then return doc.createElement('b')
        when 'italic'     then return doc.createElement('i')
        when 'strike'     then return doc.createElement('s')
        when 'underline'  then return doc.createElement('u')
        else                   return doc.createElement('span')

    getAncestorAttribute: (node, attribute, includeSelf = true) ->
      tagName = TandemUtils.Attribute.getTagName(attribute)
      ancestors = Tandem.Utils.Node.getAncestorNodes(node, (node) -> 
        return node.tagName == tagName
      , includeSelf)
      return if ancestors.length > 0 then ancestors[ancestors.length - 1] else null

    getAncestorNodes: (node, atRoot = TandemUtils.Node.isLine, includeSelf = true) ->
      ancestors = []
      ancestors.push(node) if includeSelf && atRoot(node)
      while node? && !atRoot(node)
        ancestors.push(node)
        node = node.parentNode
      ancestors.push(node)
      return if node? then ancestors else []

    getAttributes: (node) ->
      return _.reduce(TandemUtils.Node.getAncestorNodes(node), (attributes, ancestor) ->
        switch ancestor.tagName
          when 'B' then attributes['bold'] = true
          when 'I' then attributes['italic'] = true
          when 'S' then attributes['strike'] = true
          when 'U' then attributes['underline'] = true
        return attributes
      , {})

    getLine: (node) ->
      ancestors = TandemUtils.Node.getAncestorNodes(node)
      return if ancestors.length > 0 then ancestors[ancestors.length - 1] else null

    getSiblings: (node, previous = true) ->
      sibling = if previous 'previousSibling' else 'nextSibling'
      siblings = []
      while node[sibling]?
        node = node[sibling]
        siblings.push(node)
      return siblings

    getPreviousSiblings: (node) ->
      return TandemUtils.Node.getSiblings(node, true)

    getNextSiblings: (node) ->
      return TandemUtils.Node.getSiblings(node, true)
      
    isLine: (node) ->
      return node.className == 'line'

    removeKeepingChildren: (doc, node) ->
      children = _.clone(node.childNodes)
      if _.all(children, (child) -> child.firstChild == null)
        span = doc.createElement('span')
        _.each(children, (child) ->
          span.appendChild(child)
        )
        children = [span]
      _.each(children, (child) ->
        node.parentNode.insertBefore(child, node)
      )
      node.parentNode.removeChild(node)

    wrap: (wrapper, node) ->
      node.parentNode.insertBefore(wrapper, node)
      wrapper.appendChild(node)


window.Tandem ||= {}
window.Tandem.Utils = TandemUtils
