compareNodes = (node1, node2, ignoredAttributes = []) ->
  return false unless node1.nodeType == node2.nodeType
  if Quill.DOM.isElement(node1)
    return false unless Quill.DOM.isElement(node2)
    return false unless node1.tagName == node2.tagName
    [attr1, attr2] = _.map([node1, node2], (node) ->
      attr = Quill.DOM.getAttributes(node)
      _.each(ignoredAttributes, (name) ->
        delete attr[name]
      )
      attr.style = attr.style.trim() if attr.style?
      return attr
    )
    return false unless _.isEqual(attr1, attr2)
    return false unless node1.childNodes.length == node2.childNodes.length
    equal = true
    _.each(Quill.DOM.getChildNodes(node1), (child1, i) ->
      if !compareNodes(child1, node2.childNodes[i], ignoredAttributes)
        equal = false
        return false
    )
    return equal
  else
    return Quill.DOM.getText(node1) == Quill.DOM.getText(node2)


beforeEach( ->
  matchers =
    toEqualDelta: ->
      return {
        compare: (actual, expected) ->
          pass = actual.isEqual(expected)
          if pass
            message = 'Deltas equal'
          else
            message = "Deltas unequal: \n#{jasmine.pp(actual)}\n\n#{jasmine.pp(expected)}\n"
          return { message: message, pass: pass }
      }

    toEqualHTML: ->
      return {
        compare: (actual, expected, ignoreClassId) ->
          [div1, div2] = _.map([actual, expected], (html) ->
            html = html.join('') if _.isArray(html)
            html = html.innerHTML if _.isElement(html)
            div = document.createElement('div')
            div.innerHTML = Quill.Normalizer.stripWhitespace(html)
            return div
          )
          ignoredAttributes = if ignoreClassId then ['class', 'id'] else []
          ignoredAttributes = ignoredAttributes.concat(['width', 'height'])   # IE adds automatically
          pass = compareNodes(div1, div2, ignoredAttributes)
          if pass
            message = 'HTMLs equal'
          else
            message = "HTMLs unequal: \n#{jasmine.pp(div1.innerHTML)}\n\n#{jasmine.pp(div2.innerHTML)}\n"
          return { message: message, pass: pass }
      }

  jasmine.addMatchers(matchers)
)
