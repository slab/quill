Delta     = require('rich-text/lib/delta')
Parchment = require('parchment')
Block     = require('../blots/block')


class Header extends Block
  @blotName: 'header'
  @tagName: ['h1', 'h2', 'h3']


