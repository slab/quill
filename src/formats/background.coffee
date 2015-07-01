Parchment = require('parchment')

class Background extends Parchment.Style
  @attrName: 'background'
  @styleName: 'backgroundColor'

Background = Parchment.define(Background)

module.exports = Background
