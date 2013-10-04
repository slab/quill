ScribeDOM   = require('./dom')
ScribeUtils = require('./utils')


class ScribeLeafFormat
  constructor: (@root, @keyName) ->

  clean: (node) ->
    ScribeDOM.removeAttributes(node)

  createContainer: ->
    throw new Error("Descendants should implement")

  matchContainer: (container) ->
    throw new Error("Descendants should implement")

  preformat: (value) ->
    throw new Error("Descendants should implement")


class ScribeTagFormat extends ScribeLeafFormat
  constructor: (@root, @keyName, @tagName) ->
    super

  approximate: (value) ->
    throw new Error('Tag format must have truthy value') unless value
    return true

  createContainer: ->
    return @root.ownerDocument.createElement(@tagName)

  matchContainer: (container) ->
    return container.tagName == @tagName

  preformat: (value) ->
    @root.ownerDocument.execCommand(@keyName, false, value)


class ScribeSpanFormat extends ScribeTagFormat
  constructor: (@root, @keyName) ->
    super(@root, @keyName, 'SPAN')

  approximate: (value) ->
    throw new Error("Descendants should implement")


class ScribeClassFormat extends ScribeSpanFormat
  constructor: (@root, @keyName) ->
    super

  approximate: (value) ->
    parts = value.split('-')
    if parts.length > 1 and parts[0] == @keyName
      return parts.slice(1).join('-')
    return false

  clean: (node) ->
    ScribeDOM.removeAttributes(node, 'class')

  createContainer: (value) ->
    container = super(value)
    ScribeDOM.addClass(container, "#{@keyName}-#{value}")
    return container

  matchContainer: (container) ->
    if super(container)
      classList = ScribeDOM.getClasses(container)
      for css in classList
        value = this.approximate(css)
        return value if value
    return false


class ScribeStyleFormat extends ScribeSpanFormat
  @getStyleObject: (container) ->
    styleString = container.getAttribute('style') or ''
    return _.reduce(styleString.split(';'), (styles, str) ->
      [name, value] = str.split(':')
      if name and value
        name = name.slice(1) if name.slice(0, 1) == " "
        value = value.slice(1) if value.slice(0, 1) == " "
        styles[name.toLowerCase()] = value
      return styles
    , {})

  constructor: (@root, @keyName, @cssName, @defaultStyle, @styles) ->
    super

  approximate: (cssValue) ->
    for key,value of @styles
      if value.toUpperCase() == cssValue.toUpperCase()
        return if key == @defaultStyle then false else key
    return false

  clean: (node) ->
    ScribeDOM.removeAttributes(node, 'style')

  createContainer: (value) ->
    container = super(value)
    cssName = _.str.camelize(@cssName)
    style = this.approximate(value)
    container.style[cssName] = @styles[style] if style
    return container

  matchContainer: (container) ->
    return false unless super(container)
    styles = ScribeStyleFormat.getStyleObject(container)
    return if styles[@cssName]? then this.approximate(styles[@cssName]) else false

  preformat: (value) ->
    value = this.approximate(value) or @defaultStyle
    console.log 'pre', value, @styles[value], _.str.camelize(@keyName)
    @root.ownerDocument.execCommand(_.str.camelize(@keyName), false, @styles[value])


class ScribeBoldFormat extends ScribeTagFormat
  constructor: (@root) ->
    super(@root, 'bold', 'B')


class ScribeItalicFormat extends ScribeTagFormat
  constructor: (@root) ->
    super(@root, 'italic', 'I')


class ScribeStrikeFormat extends ScribeTagFormat
  constructor: (@root) ->
    super(@root, 'strike', 'S')

  preformat: (value) ->
    @root.ownerDocument.execCommand('strikeThrough', false, value)


class ScribeUnderlineFormat extends ScribeTagFormat
  constructor: (@root) ->
    super(@root, 'underline', 'U')


class ScribeLinkFormat extends ScribeTagFormat
  constructor: (@root) ->
    super(@root, 'link', 'A')

  approximate: (value) ->
    value = 'http://' + value unless value.match(/^https?:\/\//)
    return value

  clean: (node) ->
    ScribeDOM.removeAttributes(node, ['href', 'title'])

  createContainer: (value) ->
    link = super(value)
    link.href = this.approximate(value)
    link.title = link.href
    return link

  matchContainer: (container) ->
    return if super(container) then container.getAttribute('href') else false


class ScribeColorFormat extends ScribeStyleFormat
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

  @normalizeColor: (value) ->
    if value[0] == '#' and value.length == 4
      return _.map(value.slice(1), (letter) -> 
        parseInt(letter + letter, 16)
      )
    else if value[0] == '#' and value.length == 7
      return [
        parseInt(value.slice(1,3), 16)
        parseInt(value.slice(3,5), 16)
        parseInt(value.slice(5,7), 16)
      ]
    else if value.indexOf('rgb') == 0
      colors = value.slice(value.indexOf('(') + 1, value.indexOf(')')).split(',')
      return _.map(colors, (color) ->
        parseInt(color)
      )
    else
      return [0,0,0]

  constructor: (@root, @keyName, @cssName, @defaultStyle, @styles) ->
    super

  approximate: (value) ->
    return value if @styles[value]?
    color = ScribeUtils.findClosestPoint(value, @styles, ScribeColorFormat.normalizeColor)
    return if color == @defaultStyle then false else color


class ScribeBackColorFormat extends ScribeColorFormat
  constructor: (@root) ->
    super(@root, 'back-color', 'background-color', 'white', ScribeColorFormat.COLORS)


class ScribeFontNameFormat extends ScribeStyleFormat
  @normalizeFont: (fontStr) ->
    return _.map(fontStr.toUpperCase().split(','), (font) ->
      return _.str.trim(font, "'\" ")
    )

  constructor: (@root) ->
    super(@root, 'font-name', 'font-family', 'sans-serif', {
      'sans-serif': "'Helvetica', 'Arial', sans-serif"
      'serif'     : "'Times New Roman', serif"
      'monospace' : "'Courier New', monospace"
    })

  approximate: (value) ->
    values = ScribeFontNameFormat.normalizeFont(value)
    for key,fonts of @styles
      fonts = ScribeFontNameFormat.normalizeFont(fonts)
      return key if _.intersection(fonts, values).length > 0
    return false


class ScribeFontSizeFormat extends ScribeStyleFormat
  @SCALE: 6.75      # Conversion from execCommand size to px

  constructor: (@root) ->
    super(@root, 'font-size', 'font-size', 'normal', {
      'huge'  : '32px'
      'large' : '18px'
      'normal': '13px'
      'small' : '10px'
    })

  approximate: (value) ->
    return value if @styles[value]?
    if _.isString(value) and value.indexOf('px') > -1
      value = parseInt(value)
    else
      value = parseInt(value) * ScribeFontSizeFormat.SCALE
    size = ScribeUtils.findClosestPoint(value, @styles, parseInt)
    return if size == @defaultStyle then false else size

  preformat: (value) ->
    value = this.approximate(value) or @defaultStyle
    size = Math.round(parseInt(@styles[value]) / ScribeFontSizeFormat.SCALE)
    @root.ownerDocument.execCommand(_.str.camelize(@keyName), false, size)


class ScribeForeColorFormat extends ScribeColorFormat
  constructor: (@root) ->
    super(@root, 'fore-color', 'color', 'black', ScribeColorFormat.COLORS)


module.exports = 
  Leaf  : ScribeLeafFormat
  Tag   : ScribeTagFormat
  Span  : ScribeSpanFormat
  Class : ScribeClassFormat
  Style : ScribeStyleFormat

  Bold      : ScribeBoldFormat
  Italic    : ScribeItalicFormat
  Link      : ScribeLinkFormat
  Strike    : ScribeStrikeFormat
  Underline : ScribeUnderlineFormat
  
  BackColor : ScribeBackColorFormat
  FontName  : ScribeFontNameFormat
  FontSize  : ScribeFontSizeFormat
  ForeColor : ScribeForeColorFormat
