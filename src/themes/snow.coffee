ScribeColorPicker   = require('./color-picker')
ScribeDefaultTheme  = require('./default')
ScribeDOM           = require('../dom')
ScribePicker        = require('./picker')


class ScribeSnowTheme extends ScribeDefaultTheme
  @COLORS: [
    "#000000", "#e60000", "#ff9900", "#ffff00", "#008A00", "#0066cc", "#9933ff"
    "#ffffff", "#facccc", "#ffebcc", "#ffffcc", "#cce8cc", "#cce0f5", "#ebd6ff"
    "#bbbbbb", "#f06666", "#ffc266", "#ffff66", "#66b966", "#66a3e0", "#c285ff"
    "#888888", "#a10000", "#b26b00", "#b2b200", "#006100", "#0047b2", "#6b24b2"
    "#444444", "#5c0000", "#663d00", "#666600", "#003700", "#002966", "#3d1466"
  ]

  constructor: (@editor) ->
    _.defaults(
      styles:
        'div.editor': { 'bottom': '15px', 'top': '15px' }
    , @editor.options.renderer)
    @pickers = []
    @editor.on(@editor.constructor.events.SELECTION_CHANGE, =>
      _.each(@pickers, (picker) ->
        picker.close()
      )
    )
    super

  addModule: (name, options) ->
    switch name
      when 'attribution'  then this.extendAttribution(options)
      when 'link-tooltip' then this.extendLinkTooltip(options)
      when 'multi-cursor' then this.extendMultiCursor(options)
      when 'toolbar'      then this.extendToolbar(options)
    return super(name, options)

  extendAttribution: (options) ->


  extendLinkTooltip: (options) ->
    @editor.renderer.addStyles(
      'a': { 'color': '#06c' }
      '#link-tooltip':
        'border': '1px solid #ccc'
        'box-shadow': '0px 0px 5px #ddd'
        'color': '#222'
      '#link-tooltip a':
        'color': '#06c'
      '#link-tooltip .input':
        'border': '1px solid #ccc'
        'margin': '0px'
        'padding': '3px'
    )

  extendMultiCursor: (options) ->
    options.template = 
     '<span class="cursor-flag">
        <span class="cursor-name"></span>
        <span class="cursor-triangle"></span>
      </span>
      <span class="cursor-caret"></span>'
    @editor.renderer.addStyles(
      '.cursor-name':
        'border-radius': '3px'
        'font-size': '11px'
        'font-family': 'Arial'
        'margin-left': '-50%'
        'padding': '4px 10px'
      '.cursor-triangle':
        'border-left': '4px solid transparent'
        'border-right': '4px solid transparent'
        'border-top': '4px solid transparent'
        'display': 'block'
        'height': '0px'
        'margin-bottom': '-1px'
        'margin-left': '-3px'
        'width': '0px'
      '.cursor.top > .cursor-flag': { 'bottom': '100%', 'top': 'auto' }
    )

  extendToolbar: (options) ->
    this.addStyleSheet('styles/snow.css')
    options.container = document.getElementById(options.container) if _.isString(options.container)
    _.each(options.container.querySelectorAll('.font-name, .font-size'), (select) =>
      picker = new ScribePicker(select)
      @pickers.push(picker)
    )
    _.each(['fore-color', 'back-color'], (css) =>
      select = options.container.querySelector(".#{css}")
      return unless select?
      picker = new ScribeColorPicker(select)
      @pickers.push(picker)
      ScribeDOM.addClass(picker.container.querySelector('.picker-label'), 'format-button')
      _.each(picker.container.querySelectorAll('.picker-item'), (item, i) ->
        ScribeDOM.addClass(item, 'primary-color') if i < 7
      )
      format = @editor.doc.formatManager.formats[css]
      if format?
        format.styles = _.reduce(ScribeSnowTheme.COLORS, (colors, c) ->
          colors[c] = "rgb(#{parseInt(c.substr(1,2), 16)}, #{parseInt(c.substr(3,2), 16)}, #{parseInt(c.substr(5,2), 16)})"
          return colors
        , {})
        format.defaultStyle = if css == 'fore-color' then '#ffffff' else '#000000'
    )


module.exports = ScribeSnowTheme
