dom = require('../../lib/dom')
baseStyles = require('./base.styl')


class BaseTheme
  @OPTIONS: {}

  constructor: (@quill, styles = true) ->
    @quill.container.classList.add('ql-container')
    this.addStyles(baseStyles) if styles
    if dom.isIE(10)
      version = if dom.isIE(9) then '9' else '10'
      @quill.root.classList.add('ql-ie-' + version)

  addStyles: (css) ->
    style = document.createElement('style')
    style.type = 'text/css'
    style.appendChild(document.createTextNode(css))
    document.head.appendChild(style)


module.exports = BaseTheme
