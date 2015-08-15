compareNodes = (node1, node2, ignoredAttributes = []) ->
  if node1.nodeType != node2.nodeType
    return "Expected nodeType '#{node1.nodeType}' to equal '#{node2.nodeType}'"
  if node1.nodeType == node1.ELEMENT_NODE
    if node1.tagName != node2.tagName
      return "Expected tagName '#{node1.tagName}' to equal '#{node2.tagName}'"
    [attr1, attr2] = _.map([node1, node2], (node) ->
      return _.reduce(node.attributes, (attr, elem) ->
        if (ignoredAttributes.indexOf(elem.name) < 0)
          attr[elem.name] = if elem.name == 'style' then elem.value.trim() else elem.value
        return attr
      , {})
    )
    if !_.isEqual(attr1, attr2)
      return "Expected attributes #{jasmine.pp(attr1)} to equal #{jasmine.pp(attr2)}"
    if node1.childNodes.length != node2.childNodes.length
      return "Expected node childNodes length '#{node1.childNodes.length}' to equal '#{node2.childNodes.length}'"
    return null if node1.childNodes.length == 0
    message = ''
    if _.any($(node1).contents(), (child1, i) ->
      message = compareNodes(child1, node2.childNodes[i], ignoredAttributes)
      return message
    )
      return message
  else if $(node1).text() != $(node2).text()
    return "Expected node text '#{$(node1).text()}' to equal '#{$(node2).text()}'"
  return null


beforeEach( ->
  matchers =
    toEqualDelta: ->
      return {
        compare: (actual, expected) ->
          pass = _.isEqual(actual, expected)
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
            html = html.join('') if Array.isArray(html)
            html = html.innerHTML if _.isElement(html)
            div = document.createElement('div')
            div.innerHTML = html
            return div
          )
          ignoredAttributes = ['width', 'height']   # IE adds automatically
          ignoredAttributes = ignoredAttributes.concat(['class', 'id']) if ignoreClassId
          if message = compareNodes(div1, div2, ignoredAttributes)
            console.error(div1.innerHTML)
            console.error(div2.innerHTML)
            return { pass: false, message: message }
          else
            return { pass: true, message: 'HTMLs equal' }
      }

    toBeApproximately: ->
      return {
        compare: (actual, expected, tolerance) ->
          pass = Math.abs(actual - expected) <= tolerance
          return {
            pass: pass
            message: "#{actual} is #{if pass then '' else 'not'} approximately #{expected}"
          }
      }

  jasmine.addMatchers(matchers)
)
