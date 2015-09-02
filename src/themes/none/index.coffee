_ = require('lodash')
dom = require('../../lib/dom')

class BaseTheme

  constructor: (@quill, @options) ->
    dom(@quill.container).addClass('ql-container')
    if dom.isIE(10)
      version = if dom.isIE(9) then '9' else '10'
      dom(@quill.root).addClass('ql-ie-' + version)


module.exports = BaseTheme
