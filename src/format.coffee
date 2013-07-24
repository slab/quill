Scribe = require('./scribe')
Scribe.Format ?= {}


class Scribe.Format.Leaf
  constructor: (@root, @keyName) ->

  clean: (node) ->
    Scribe.DOM.removeAttributes(node)

  createContainer: (value) ->
    throw new Error("Descendants should implement")

  matchContainer: (container) ->
    throw new Error("Descendants should implement")


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

  clean: (node) ->
    Scribe.DOM.removeAttributes(node, 'class')

  createContainer: (value) ->
    container = super(value)
    Scribe.DOM.addClass(container, "#{@keyName}-#{value}")
    return container

  matchContainer: (container) ->
    if super(container)
      classList = Scribe.DOM.getClasses(container)
      for css in classList
        parts = css.split('-')
        if parts.length > 1 and parts[0] == @keyName
          return parts.slice(1).join('-')
    return false


class Scribe.Format.Style extends Scribe.Format.Span
  @getStyleObject: (container) ->
    styleString = container.getAttribute('style') or ''
    return _.reduce(styleString.split(';'), (styles, str) ->
      if str.length > 0
        [name, value] = str.split(':')
        name = name.slice(1) if name[0] == ' '
        value = value.slice(1) if value[0] == ' '
        styles[name.toLowerCase()] = value
      return styles
    , {})

  @getCamelCase: (cssName) ->
    nameArr = cssName.split('-')
    capitalNameArr = _.map(nameArr, (name) ->
      return name[0].toUpperCase() + name.slice(1)
    )
    return nameArr[0] + capitalNameArr.slice(1).join('')

  constructor: (@root, @keyName, @cssName, @styles, @matchFn) ->
    @matchFn or= (cssValue) =>
      for key,value of @styles
        return key if value == cssValue
      return false
    super

  clean: (node) ->
    Scribe.DOM.removeAttributes(node, 'style')

  createContainer: (value) ->
    container = super(value)
    return container unless @styles[value]?
    cssName = Scribe.Format.Style.getCamelCase(@cssName)
    container.style[cssName] = @styles[value] if @styles[value]
    return container

  matchContainer: (container) ->
    return false unless super(container)
    styles = Scribe.Format.Style.getStyleObject(container)
    return if styles[@cssName]? then @matchFn(styles[@cssName]) else false


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

  clean: (node) ->
    Scribe.DOM.removeAttributes(node, ['href', 'title'])

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
    colors = _.clone(Scribe.Format.Color.COLORS)
    delete colors['white']
    super(@root, 'background', 'background-color', colors, Scribe.Format.Color.matchColor)


class Scribe.Format.Color extends Scribe.Format.Style
  @COLORS: {
    'black'   : '#000000'
    'red'     : '#FF0000'
    'blue'    : '#0000FF'
    'lime'    : '#00FF00'
    'teal'    : '#00FFFF'
    'magenta' : '#FF00FF'
    'yellow'  : '#FFFF00'
    'white'   : '#FFFFFF'
  }

  @normalizeColor: (color) ->
    color = Scribe.Format.Color.COLORS[color] if Scribe.Format.Color.COLORS[color]?
    if color[0] == '#'
      if color.length == 4
        color = '#' + _.map(color.slice(1), (letter) ->
          letter + letter
        ).join('')
      return color
    else if color.indexOf('rgb(') == 0
      color = color.slice(4)
      color = _.reduce(color.split(',').slice(0, 3), (color, part) ->
        c = parseInt(part, 10).toString(16).toUpperCase()
        c = '0' + c if c.length == 1
        return color + c
      , '#')
      return color
    else
      return '#000000'

  @matchColor: (cssValue) ->
    color = Scribe.Format.Color.normalizeColor(cssValue)
    for key,value of @styles
      return key if value == color
    return false

  constructor: (@root) ->
    colors = _.clone(Scribe.Format.Color.COLORS)
    delete colors['black']
    super(@root, 'color', 'color', colors, Scribe.Format.Color.matchColor)


class Scribe.Format.Family extends Scribe.Format.Style
  constructor: (@root) ->
    super(@root, 'family', 'font-family', {
      'serif'     : "'Times New Roman', serif"
      'monospace' : "'Courier New', monospace"
    }, (cssValue) =>
      for key,value of @styles
        return key if value.indexOf(key) > -1
      return false
    )


class Scribe.Format.Size extends Scribe.Format.Style
  constructor: (@root) ->
    super(@root, 'size', 'font-size', {
      'huge'  : '32px'
      'large' : '18px'
      'small' : '10px'
    })

  createContainer: (value) ->
    container = super(value)
    return container



module.exports = Scribe
