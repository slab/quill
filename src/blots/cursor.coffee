Delta     = require('rich-text/lib/delta')
Parchment = require('parchment')
dom       = require('../lib/dom')


class Cursor extends Parchment.Inline
  @blotName = 'aaacursor'       # TODO create real inline compare function
  @className = 'ql-cursor'

  constructor: (domNode) ->
    super(domNode)
    this.appendChild(Parchment.create('text', dom.ZERO_WIDTH_NOBREAK_SPACE))
    dom(this.domNode).on('blur', =>
      console.log(this)
    )


module.exports = Cursor
