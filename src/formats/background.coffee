Parchment = require('parchment')

class Background extends Parchment.Style
  @attrName: 'background'
  @styleName: 'backgroundColor'

Parchment.define(Background)

module.exports = Background
