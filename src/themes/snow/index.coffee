_           = require('lodash')
ColorPicker = require('../../lib/color-picker')
BaseTheme   = require('../base')
dom         = require('../../lib/dom')
Picker      = require('../../lib/picker')


class SnowTheme extends BaseTheme
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

  @STYLES:
    '.snow .image-tooltip-container a':
      'border': '1px solid #06c'
    '.snow .image-tooltip-container a.insert':
      'background-color': '#06c'
      'color': '#fff'
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
    '.snow a':
      'color': '#06c'
    '.snow .tooltip':
      'border': '1px solid #ccc'
      'box-shadow': '0px 0px 5px #ddd'
      'color': '#222'
    '.snow .tooltip a':
      'color': '#06c'
    '.snow .tooltip .input':
      'border': '1px solid #ccc'
      'margin': '0px'
      'padding': '5px'
    '.snow .image-tooltip-container .preview':
      'border-color': '#ccc'
      'color': '#ccc'
    '.snow .link-tooltip-container a, .snow .link-tooltip-container span':
      'display': 'inline-block'
      'line-height': '25px'

  constructor: (@quill) ->
    super
    this.addStyles(SnowTheme.STYLES)
    @pickers = []
    @quill.on(@quill.constructor.events.SELECTION_CHANGE, (range) =>
      _.invoke(@pickers, 'close') if range?
    )
    dom(document.body).addClass('snow')
    @quill.onModuleLoad('multi-cursor', _.bind(this.extendMultiCursor, this))
    @quill.onModuleLoad('toolbar', _.bind(this.extendToolbar, this))

  extendMultiCursor: (module) ->
    module.on(module.constructor.events.CURSOR_ADDED, (cursor) ->
      bottomTriangle = cursor.elem.querySelector('.cursor-triangle.bottom')
      topTriangle = cursor.elem.querySelector('.cursor-triangle.top')
      bottomTriangle.style.borderTopColor = topTriangle.style.borderBottomColor = cursor.color
    )

  extendToolbar: (module) ->
    _.each(['color', 'background', 'font', 'size', 'align'], (format) =>
      select = module.container.querySelector(".ql-#{format}")
      return unless select?
      switch format
        when 'font', 'size', 'align'
          picker = new Picker(select)
        when 'color', 'background'
          picker = new ColorPicker(select)
          _.each(picker.container.querySelectorAll('.ql-picker-item'), (item, i) ->
            dom(item).addClass('ql-primary-color') if i < 7
          )
      @pickers.push(picker) if picker?
    )
    _.each(dom(module.container).textNodes(), (node) ->
      if dom(node).text().trim().length == 0
        dom(node).remove()
    )


module.exports = SnowTheme
