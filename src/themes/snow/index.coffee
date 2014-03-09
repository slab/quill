_                   = require('lodash')
ScribeColorPicker   = require('../color-picker')
ScribeDefaultTheme  = require('../default')
ScribeDOM           = require('../../dom')
ScribePicker        = require('../picker')


class ScribeSnowTheme extends ScribeDefaultTheme
  @COLORS: [
    "#000000", "#e60000", "#ff9900", "#ffff00", "#008A00", "#0066cc", "#9933ff"
    "#ffffff", "#facccc", "#ffebcc", "#ffffcc", "#cce8cc", "#cce0f5", "#ebd6ff"
    "#bbbbbb", "#f06666", "#ffc266", "#ffff66", "#66b966", "#66a3e0", "#c285ff"
    "#888888", "#a10000", "#b26b00", "#b2b200", "#006100", "#0047b2", "#6b24b2"
    "#444444", "#5c0000", "#663d00", "#666600", "#003700", "#002966", "#3d1466"
  ]

  @OPTIONS:
    'multi-cursor':
      template:
       '<span class="cursor-flag">
          <span class="cursor-triangle top"></span>
          <span class="cursor-name"></span>
          <span class="cursor-triangle bottom"></span>
        </span>
        <span class="cursor-caret"></span>'

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
    options = _.defaults(ScribeSnowTheme.OPTIONS[name] or {}, options)
    module = super(name, options)
    switch name
      when 'authorship'   then this.extendAuthorship(module)
      when 'link-tooltip' then this.extendLinkTooltip(module)
      when 'multi-cursor' then this.extendMultiCursor(module)
      when 'toolbar'      then this.extendToolbar(module)
    return module

  extendAuthorship: (module) ->


  extendLinkTooltip: (module) ->
    @editor.renderer.addStyles(
      '.editor-container a': { 'color': '#06c' }
      '.editor-container #link-tooltip':
        'border': '1px solid #ccc'
        'box-shadow': '0px 0px 5px #ddd'
        'color': '#222'
      '.editor-container #link-tooltip a':
        'color': '#06c'
      '.editor-container #link-tooltip .input':
        'border': '1px solid #ccc'
        'margin': '0px'
        'padding': '3px'
    )

  extendMultiCursor: (module) ->
    @editor.renderer.addStyles(
      '.editor-container .cursor-name':
        'border-radius': '4px'
        'font-size': '11px'
        'font-family': 'Arial'
        'margin-left': '-50%'
        'padding': '4px 10px'
      '.editor-container .cursor-triangle':
        'border-left': '4px solid transparent'
        'border-right': '4px solid transparent'
        'height': '0px'
        'margin-left': '-3px'
        'width': '0px'
      '.editor-container .cursor.left .cursor-name':
        'margin-left': '-8px'
      '.editor-container .cursor.right .cursor-name':
        'margin-left': '-100%'
        'margin-right': '-8px'
      '.editor-container .cursor-triangle.bottom':
        'border-top': '4px solid transparent'
        'display': 'block'
        'margin-bottom': '-1px'
      '.editor-container .cursor-triangle.top':
        'border-bottom': '4px solid transparent'
        'display': 'none'
        'margin-top': '-1px'
      '.editor-container .cursor.top .cursor-triangle.bottom':
        'display': 'none'
      '.editor-container .cursor.top .cursor-triangle.top':
        'display': 'block'
    )
    module.on(module.constructor.events.CURSOR_ADDED, (cursor) ->
      bottomTriangle = cursor.elem.querySelector('.cursor-triangle.bottom')
      topTriangle = cursor.elem.querySelector('.cursor-triangle.top')
      bottomTriangle.style.borderTopColor = topTriangle.style.borderBottomColor = cursor.color
    )

  extendToolbar: (module) ->
    ScribeDOM.addClass(module.container, 'sc-toolbar-container')
    _.each(module.container.querySelectorAll('.sc-font-name, .sc-font-size'), (select) =>
      picker = new ScribePicker(select)
      @pickers.push(picker)
    )
    _.each(['fore-color', 'back-color'], (css) =>
      select = module.container.querySelector(".sc-#{css}")
      return unless select?
      picker = new ScribeColorPicker(select)
      @pickers.push(picker)
      ScribeDOM.addClass(picker.container.querySelector('.sc-picker-label'), 'sc-format-button')
      _.each(picker.container.querySelectorAll('.sc-picker-item'), (item, i) ->
        ScribeDOM.addClass(item, 'sc-primary-color') if i < 7
      )
      format = @editor.doc.formatManager.formats[css]
      if format?
        format.styles = _.reduce(ScribeSnowTheme.COLORS, (colors, c) ->
          colors[c] = "rgb(#{parseInt(c.substr(1,2), 16)}, #{parseInt(c.substr(3,2), 16)}, #{parseInt(c.substr(5,2), 16)})"
          return colors
        , {})
        format.defaultStyle = if css == 'sc-fore-color' then '#000000' else '#ffffff'
    )


module.exports = ScribeSnowTheme
