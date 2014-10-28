_ = require('lodash')
dom = require('../../lib/dom')


class BaseTheme
  @OPTIONS: {}

  @objToCss: (obj) ->
    return _.map(obj, (value, key) ->
      innerStr = _.map(value, (innerValue, innerKey) ->
        return "#{innerKey}: #{innerValue};"
      ).join(' ')
      return "#{key} { #{innerStr} }"
    ).join("\n")

  constructor: (@quill) ->
    dom(@quill.root.parentNode).addClass('ql-container')
    dom(@quill.root).addClass('ql-editor-container')

  addStyles: (css) ->
    if _.isObject(css)
      style = document.createElement('style')
      style.type = 'text/css'
      css = BaseTheme.objToCss(css)
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


module.exports = BaseTheme
