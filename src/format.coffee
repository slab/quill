ScribeDOM = require('./dom')


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
    parts = css.split('-')
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

  @getCamelCase: (cssName) ->
    nameArr = cssName.split('-')
    capitalNameArr = _.map(nameArr, (name) ->
      return name[0].toUpperCase() + name.slice(1)
    )
    return nameArr[0] + capitalNameArr.slice(1).join('')

  constructor: (@root, @keyName, @cssName, @styles) ->
    super

  approximate: (cssValue) ->
    for key,value of @styles
      return key if value.toUpperCase() == cssValue.toUpperCase()
    return false

  clean: (node) ->
    ScribeDOM.removeAttributes(node, 'style')

  createContainer: (value) ->
    container = super(value)
    cssName = ScribeStyleFormat.getCamelCase(@cssName)
    debugger
    container.style[cssName] = this.approximate(value)
    console.log 'create dat container', value, cssName, this.approximate(value)
    return container

  matchContainer: (container) ->
    return false unless super(container)
    styles = ScribeStyleFormat.getStyleObject(container)
    return if styles[@cssName]? then this.approximate(styles[@cssName]) else false


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

  approximate: (value) ->
    return value if @styles[value]?
    c = ScribeColorFormat.normalizeColor(value)
    closestDist = Infinity
    closestColor = false
    for key,hex of @styles
      p = ScribeColorFormat.normalizeColor(hex)
      dist = Math.sqrt(Math.pow(p[0]-c[0], 2) + Math.pow(p[1]-c[1], 2) + Math.pow(p[2]-c[2], 2))
      return key if dist == 0
      if dist < closestDist
        closestDist = dist
        closestColor = key
    return closestColor


class ScribeBackColorFormat extends ScribeColorFormat
  constructor: (@root) ->
    super(@root, 'background', 'background-color', ScribeColorFormat.COLORS)

  approximate: (value) ->
    color = super(value)
    return if color == 'white' then false else color

  preformat: (color) ->
    color = this.approximate(color)
    @root.ownerDocument.execCommand('backColor', false, @styles[color]) if color != 'white'


class ScribeFamilyFormat extends ScribeStyleFormat
  constructor: (@root) ->
    super(@root, 'family', 'font-family', {
      'serif'     : "'Times New Roman', serif"
      'monospace' : "'Courier New', monospace"
    })

  approximate: (value) ->
    value = value.toUpperCase()
    for key,font of @styles
      return key if font.toUpperCase().indexOf(value) > -1
    return false

  preformat: (family) ->
    family = @styles[family] if family
    @root.ownerDocument.execCommand('fontName', false, family)


class ScribeForeColorFormat extends ScribeColorFormat
  constructor: (@root) ->
    super(@root, 'color', 'color', ScribeColorFormat.COLORS)

  approximate: (value) ->
    color = super(value)
    return if color == 'black' then false else color

  preformat: (color) ->
    color = this.approximate(color)
    @root.ownerDocument.execCommand('foreColor', false, @styles[color]) if color != 'black'


class ScribeSizeFormat extends ScribeStyleFormat
  constructor: (@root) ->
    super(@root, 'size', 'font-size', {
      'huge'  : '32px'
      'large' : '18px'
      'small' : '10px'
    })

  approximate: (value) ->
    return value if @styles[value]?
    if _.isString(value) and value.indexOf('px') > -1
      value = parseInt(value)
      return 'small'  if value < 11
      return false    if 11 <= value and value < 15
      return 'large'  if 15 <= value and value < 25
      return 'huge'
    else
      value = parseInt(value)
      return 'small'  if value < 2
      return false    if 2 <= value and value < 3
      return 'large'  if 3 <= value and value < 5
      return 'huge'

  preformat: (size) ->
    switch size
      when 'huge'   then size = 5
      when 'large'  then size = 3
      when 'small'  then size = 1
      else               size = 2
    @root.ownerDocument.execCommand('fontSize', false, size)


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
  Family    : ScribeFamilyFormat
  ForeColor : ScribeForeColorFormat
  Size      : ScribeSizeFormat
