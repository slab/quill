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

  @getCamelCase: (cssName) ->
    nameArr = cssName.split('-')
    capitalNameArr = _.map(nameArr, (name) ->
      return name[0].toUpperCase() + name.slice(1)
    )
    return nameArr[0] + capitalNameArr.slice(1).join('')

  constructor: (@root, @keyName, @cssName, @styles, @matchFn) ->
    @matchFn or= (formatName, cssValue) =>
      return @styles[formatName] == cssValue
    super

  createContainer: (value) ->
    container = super(value)
    return container unless @styles[value]?
    cssName = Scribe.Format.Style.getCamelCase(@cssName)
    container.style[@cssName] = @styles[value] if @styles[value]
    return container

  matchContainer: (container) ->
    return false unless super(container)
    styles = Scribe.Format.Style.getStyleObject(container)
    if styles[@cssName]?
      for formatName of @styles
        return formatName if @matchFn(formatName, styles[@cssName])
    return false

module.exports = Scribe
