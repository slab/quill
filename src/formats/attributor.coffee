Parchment = require('parchment')


class StyleAttributor extends Parchment.Style
  constructor: (attrName, styleName, @options) ->
    super(attrName, styleName)

  add: (node, value) ->
    if @options.whitelist? and @options.whitelist.indexOf(value) < 0
      return
    if @options.default? and value == @options.default
      return this.remove(node)
    blot = Parchment.findBlot(node)
    return unless blot? and blot instanceof Parchment.Block
    super(node, value)


module.exports = StyleAttributor
