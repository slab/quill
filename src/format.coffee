Scribe = require('./scribe')
Scribe.Format ?= {}


class Scribe.Format.Leaf
  constructor: (@root, @keyName) ->

  createContainer: (value) ->
    console.error('Descendants should implement')

  matchContainer: (container) ->
    console.error('Descendants should implement')


class Scribe.Format.Tag extends Scribe.Format.Leaf
  constructor: (@root, @keyName, @tagName) ->
    super

  createContainer: (value) ->
    return @root.ownerDocument.createElement(@tagName)

  matchContainer: (container) ->
    return container.tagName == @tagName


class Scribe.Format.Span extends Scribe.Format.Tag
  constructor: (@root, @keyName) ->
    super(@root, @keyName, 'SPAN')


class Scribe.Format.Class extends Scribe.Format.Span
  constructor: (@root, @keyName) ->
    super

  createContainer: (value) ->
    container = super(value)
    container.classList.add("#{name}-#{value}")
    return container

  matchContainer: (container) ->
    if super(container)
      for css in container.classList
        parts = css.split('-')
        if parts.length > 1 and parts[0] == @keyName
          return [@keyName, parts.slice(1).join('-')]
    return false


class Scribe.Format.Style extends Scribe.Format.Span
  @getStyleObject: (container) ->
    styleString = container.getAttribute('style') or ''
    return _.reduce(styleString.split(';').slice(0, -1), (styles, str) ->
      [name, value] = str.split(':')
      value = value.slice(1) if value[0] == ' '
      styles[name] = value
      return styles
    , {})

  constructor: (@root, @keyName, @styles) ->
    super

  createContainer: (value) ->
    container = super(value)
    return container unless @styles[value]?
    _.each(@styles[value], (cssValue, cssName) ->
      container.style[cssName] = cssValue
    )
    return container


module.exports = Scribe
