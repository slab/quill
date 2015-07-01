Parchment = require('parchment')

class Size extends Parchment.Style
  @attrName: 'size'
  @styleName: 'fontSize'

Parchment.define(Size)

module.exports = Size
