_ = require('lodash')
dom = require('../../lib/dom')
baseStyles = require('./base.styl')


class BaseTheme
  @OPTIONS: {}

  @objToCss: (obj) ->
    return _.map(obj, (value, key) ->
      innerStr = _.map(value, (innerValue, innerKey) ->
        return "#{innerKey}: #{innerValue};"
      ).join(' ')
      return "#{key} { #{innerStr} }"
    ).join("\n")

  constructor: (@quill, @options) ->
    @quill.container.classList.add('ql-container')
    if @options.styles
      this.addStyles(baseStyles + BaseTheme.objToCss(@options.styles))
    if dom.isIE(10)
      version = if dom.isIE(9) then '9' else '10'
      @quill.root.classList.add('ql-ie-' + version)

  addStyles: (css) ->
    css = BaseTheme.objToCss(css) if typeof css == 'object'
    style = document.createElement('style')
    style.type = 'text/css'
    style.appendChild(document.createTextNode(css))
    document.head.appendChild(style)


module.exports = BaseTheme
