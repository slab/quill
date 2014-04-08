_            = require('lodash')
ColorPicker  = require('../color-picker')
DefaultTheme = require('../default')
DOM          = require('../../dom')
Picker       = require('../picker')


class SnowTheme extends DefaultTheme
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

  constructor: (@quill, options) ->
    super
    @pickers = []
    @quill.on(@quill.constructor.events.SELECTION_CHANGE, =>
      _.each(@pickers, (picker) ->
        picker.close()
      )
    )
    DOM.addClass(@editorContainer.ownerDocument.body, 'snow')
    @quill.onModuleLoad('link-tooltip', _.bind(this.extendLinkTooltip, this))
    @quill.onModuleLoad('multi-cursor', _.bind(this.extendMultiCursor, this))
    @quill.onModuleLoad('toolbar', _.bind(this.extendToolbar, this))

  extendLinkTooltip: (module) ->
    @quill.addStyles(
      '.snow a':
        'color': '#06c'
      '.snow .link-tooltip-container':
        'border': '1px solid #ccc'
        'box-shadow': '0px 0px 5px #ddd'
        'color': '#222'
      '.snow .link-tooltip-container a':
        'color': '#06c'
      '.snow .link-tooltip-container .input':
        'border': '1px solid #ccc'
        'margin': '0px'
        'padding': '3px'
    )

  extendMultiCursor: (module) ->
    @quill.addStyles(
      '.snow .cursor-name':
        'border-radius': '4px'
        'font-size': '11px'
        'font-family': 'Arial'
        'margin-left': '-50%'
        'padding': '4px 10px'
      '.snow .cursor-triangle':
        'border-left': '4px solid transparent'
        'border-right': '4px solid transparent'
        'height': '0px'
        'margin-left': '-3px'
        'width': '0px'
      '.snow .cursor.left .cursor-name':
        'margin-left': '-8px'
      '.snow .cursor.right .cursor-flag':
        'right': 'auto'
      '.snow .cursor.right .cursor-name':
        'margin-left': '-100%'
        'margin-right': '-8px'
      '.snow .cursor-triangle.bottom':
        'border-top': '4px solid transparent'
        'display': 'block'
        'margin-bottom': '-1px'
      '.snow .cursor-triangle.top':
        'border-bottom': '4px solid transparent'
        'display': 'none'
        'margin-top': '-1px'
      '.snow .cursor.top .cursor-triangle.bottom':
        'display': 'none'
      '.snow .cursor.top .cursor-triangle.top':
        'display': 'block'
    )
    module.on(module.constructor.events.CURSOR_ADDED, (cursor) ->
      bottomTriangle = cursor.elem.querySelector('.cursor-triangle.bottom')
      topTriangle = cursor.elem.querySelector('.cursor-triangle.top')
      bottomTriangle.style.borderTopColor = topTriangle.style.borderBottomColor = cursor.color
    )

  extendToolbar: (module) ->
    _.each(module.container.querySelectorAll('.sc-font, .sc-size'), (select) =>
      picker = new Picker(select)
      @pickers.push(picker)
    )
    _.each(['color', 'background'], (css) =>
      select = module.container.querySelector(".sc-#{css}")
      return unless select?
      picker = new ColorPicker(select)
      @pickers.push(picker)
      DOM.addClass(picker.container.querySelector('.sc-picker-label'), 'sc-format-button')
      _.each(picker.container.querySelectorAll('.sc-picker-item'), (item, i) ->
        DOM.addClass(item, 'sc-primary-color') if i < 7
      )
    )


module.exports = SnowTheme
