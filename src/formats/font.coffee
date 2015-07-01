Parchment = require('parchment')

class Font extends Parchment.Style
  @attrName: 'font'
  @styleName: 'fontFamily'

Font = Parchment.define(Font)

module.exports = Font
