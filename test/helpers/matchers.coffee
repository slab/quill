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
            html = html.innerHTML unless _.isString(html)
            html = Quill.Normalizer.stripWhitespace(html)
            if ignoreClassId
              html = html.replace(/\ (class|id)="[a-z0-9\-_]+"/gi, '')
              html = html.replace(/\ (class|id)=[a-z0-9\-_]+/gi, '')
              html = html.replace(/\ (class|id)=[a-z0-9\-_]+>/gi, '>')
            html = html.replace(/style="([^"]+); /g, 'style="$1;"')   # PhantomJS adds space after last style
            html = html.replace(/[\'\";]/g, '')    # IE8 outerHTML does not have quotes
            html = html.replace(/rgb\((\d+), ?(\d+), ?(\d+)\)/g, "rgb($1, $2, $3)") # IE8 removes spaces between digits
            html = html.replace(/\ width=\d+/g, '').replace(/\ height=\d+/g, '')  # IE10 adds width, height to image tags
            html = html.toLowerCase()              # IE8 uppercases their tags
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
