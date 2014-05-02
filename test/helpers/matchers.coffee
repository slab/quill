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
          [html1, html2] = _.map([actual, expected], (html) ->
            html = html.join('') if _.isArray(html)
            html = html.innerHTML if _.isElement(html)
            div = document.createElement('div')
            div.innerHTML = Quill.Normalizer.stripWhitespace(html)
            if ignoreClassId
              _.each(div.querySelectorAll('*'), (node) ->
                node.removeAttribute('class')
                node.removeAttribute('id')
              )
            # IE adds width/height attributes automatically
            _.each(div.querySelectorAll('img'), (node) ->
              node.removeAttribute('width')
              node.removeAttribute('height')
            )
            html = div.innerHTML
            html = html.replace(/style="([^"]+); "/g, 'style="$1;"')   # PhantomJS adds space after last style
            return html
          )
          pass = html1 == html2
          if pass
            message = 'HTMLs equal'
          else
            message = "HTMLs unequal: \n#{jasmine.pp(html1)}\n\n#{jasmine.pp(html2)}\n"
          return { message: message, pass: pass }
      }

  jasmine.addMatchers(matchers)
)
