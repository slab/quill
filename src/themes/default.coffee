_ = require('lodash')

class DefaultTheme
  @OPTIONS: {}

  @objToCss: (obj) ->
    return _.map(obj, (value, key) ->
      innerStr = _.map(value, (innerValue, innerKey) ->
        return "#{innerKey}: #{innerValue};"
      ).join(' ')
      return "#{key} { #{innerStr} }"
    ).join("\n")

  constructor: (@quill) ->
    @editor = @quill.editor
    @editorContainer = @editor.root

  addStyles: (css) ->
    if _.isObject(css)
      style = document.createElement('style')
      style.type = 'text/css'
      css = DefaultTheme.objToCss(css)
      style.appendChild(document.createTextNode(css))
      document.head.appendChild(style)
    else if _.isString(css)
      link = document.createElement('link')
      dom(link).attributes(
        type: 'text/css'
        rel: 'stylesheet'
        href: css
      )
      document.head.appendChild(link)


module.exports = DefaultTheme
