Scribe = require('./scribe')
Scribe.Format ?= {}


class Scribe.Format.Leaf
  constructor: (@root, @keyName) ->

  clean: (node) ->
    Scribe.DOM.removeAttributes(node)

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

  clean: (node) ->
    Scribe.DOM.removeAttributes(node, 'style')

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


class Scribe.Format.Bold extends Scribe.Format.Tag
  constructor: (@root) ->
    super(@root, 'bold', 'B')


class Scribe.Format.Italic extends Scribe.Format.Tag
  constructor: (@root) ->
    super(@root, 'italic', 'I')


class Scribe.Format.Strike extends Scribe.Format.Tag
  constructor: (@root) ->
    super(@root, 'strike', 'S')


class Scribe.Format.Underline extends Scribe.Format.Tag
  constructor: (@root) ->
    super(@root, 'underline', 'U')


class Scribe.Format.Link extends Scribe.Format.Tag
  constructor: (@root) ->
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
    colors = _.extend({}, Scribe.Format.Color.COLORS)
    delete colors['white']
    super(@root, 'background', 'background-color', colors, Scribe.Format.Color.matchColor)


class Scribe.Format.Color extends Scribe.Format.Style
  @COLORS: {
    'black'   : '#000'
    'red'     : '#F00'
    'blue'    : '#00F'
    'lime'    : '#0F0'
    'teal'    : '#0FF'
    'magenta' : '#F0F'
    'yellow'  : '#FF0'
    'white'   : '#FFF'
  }

  @normalizeColor: (color) ->
    color = Scribe.Format.Color.COLORS[color] if Scribe.Format.Color.COLORS[color]?
    if color[0] == '#'
      color = color.slice(1)
      if color.length == 3
        color = _.map(color, (letter) ->
          letter + letter
        ).join('')
      return [
        parseInt(color.slice(0, 2), 16)
        parseInt(color.slice(2, 4), 16)
        parseInt(color.slice(4, 6), 16)
      ]
    else if color.indexOf('rgb(') == 0
      color = color.slice(4)
      return _.map(color.split(',').slice(0, 3), (part) ->
        parseInt(part, 10)
      )
    else
      return [0, 0, 0]

  @matchColor: (color1, color2) ->
    color1 = Scribe.Format.Color.normalizeColor(color1)
    color2 = Scribe.Format.Color.normalizeColor(color2)
    return _.isEqual(color1, color2)

  constructor: (@root) ->
    colors = _.extend({}, Scribe.Format.Color.COLORS)
    delete colors['black']
    super(@root, 'color', 'color', colors, Scribe.Format.Color.matchColor)


class Scribe.Format.Family extends Scribe.Format.Style
  constructor: (@root) ->
    super(@root, 'family', 'font-family', {
      'serif'     : "'Times New Roman', serif"
      'monospace' : "'Courier New', monospace"
    }, (formatValue, cssValue) =>
      return cssValue.indexOf(formatValue) >= 0
    )


class Scribe.Format.Size extends Scribe.Format.Style
  constructor: (@root) ->
    super(@root, 'size', 'font-size', {
      'huge'  : '32px'
      'large' : '18px'
      'small' : '10px'
    })
    @lineHeights = {
      'huge'  : '36px'
      'large' : '22px'
      'small' : '12px'
    }

  createContainer: (value) ->
    container = super(value)
    container.style.lineHeight = @lineHeights[value] if @lineHeights[value]?
    return container


module.exports = Scribe
