beforeEach( ->
  matchers =
    toEqualDelta: (other) ->
      return {
        compare: (actual, expected) ->
          pass = actual.isEqual(expected)
          if pass
            message = 'Deltas equal'
          else
            message = "Deltas unequal: \n#{jasmine.pp(actual)}\n\n#{jasmine.pp(expected)}\n"
          return { message: message, pass: pass }
      }

  jasmine.addMatchers(matchers)
)

expect.equalHTML = (html1, html2, ignoreClassId = false) ->
  [html1, html2] = _.map([html1, html2], (html) ->
    html = html.join('') if _.isArray(html)
    html = html.innerHTML unless _.isString(html)
    html = Quill.Normalizer.stripWhitespace(html)
    if ignoreClassId
      html = html.replace(/\ (class|id)="[a-z0-9\-_]+"/gi, '')
      html = html.replace(/\ (class|id)=[a-z0-9\-_]+/gi, '')
      html = html.replace(/\ (class|id)=[a-z0-9\-_]+>/gi, '>')
    html = html.replace(/style="(.+); "/g, 'style="$1;"')   # PhantomJS adds space after last style
    html = html.replace(/[\'\";]/g, '')    # IE8 outerHTML does not have quotes
    html = html.replace(/rgb\((\d+), ?(\d+), ?(\d+)\)/g, "rgb($1, $2, $3)") # IE8 removes spaces between digits
    html = html.replace(/<img width=\d+/g, '<img').replace(/<img height=\d+/g, '<img')  # IE10 adds width, height to image tags
    html = html.toLowerCase()              # IE8 uppercases their tags
    return html
  )
  expect(html1).toEqual(html2)
