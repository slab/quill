baseStyles = require('./base.styl')
platform = require('../../lib/platform')


class BaseTheme
  @OPTIONS: {}

  constructor: (@quill, styles = true) ->
    @quill.container.classList.add('ql-container')
    this.addStyles(baseStyles) if styles
    @quill.root.classList.add('ql-ie-10') if platform.isIE(10)

  addStyles: (css) ->
    style = document.createElement('style')
    style.type = 'text/css'
    style.appendChild(document.createTextNode(css))
    document.head.appendChild(style)


module.exports = BaseTheme
