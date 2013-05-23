Scribe = require('../scribe')
Scribe.Format ?= {}


class Scribe.Format.Bold extends Scribe.Format.Tag
  constructor: (@root) ->
    super(@root, 'bold', 'B')

class Scribe.Format.Italic extends Scribe.Format.Tag
  constructor: (@renderer) ->
    super(@root, 'italic', 'I')

class Scribe.Format.Strike extends Scribe.Format.Tag
  constructor: (@renderer) ->
    super(@root, 'strike', 'S')

class Scribe.Format.Underline extends Scribe.Format.Tag
  constructor: (@renderer) ->
    super(@root, 'underline', 'U')

class Scribe.Format.Link extends Scribe.Format.Tag
  constructor: (@renderer) ->
    super(@root, 'link', 'A')

  createContainer: (value) ->
    link = super(value)
    value = 'https://' + value unless value.match(/https?:\/\//)
    link.href = value
    link.href = 'about:blank' if (link.protocol != 'http:' && link.protocol != 'https:')
    link.title = link.href
    return link

  matchContainer: (container) ->
    return if super(container) then container.getAttribute('href') else false


class Scribe.Format.Background extends Scribe.Format.Style
  constructor: (@root) ->
    super(@root, 'background')


class Scribe.Format.Color extends Scribe.Format.Style
  constructor: (@root) ->
    super(@root, 'color')


class Scribe.Format.Family extends Scribe.Format.Style
  constructor: (@root) ->
    super(@root, 'family')


class Scribe.Format.Size extends Scribe.Format.Style
  constructor: (@root) ->
    super(@root, 'size')


module.exports = Scribe
