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
       '<span class="cursor-flag">\
          <span class="cursor-triangle top"></span>\
          <span class="cursor-name"></span>\
          <span class="cursor-triangle bottom"></span>\
        </span>\
        <span class="cursor-caret"></span>'

  constructor: (@quill, @options) ->
    super
    @quill.container.classList.add('ql-snow')
    @pickers = []
    @quill.on(@quill.constructor.events.SELECTION_CHANGE, (range) =>
      _.invoke(@pickers, 'close') if range?
    )
    @quill.onModuleLoad('multi-cursor', _.bind(this.extendMultiCursor, this))
    @quill.onModuleLoad('toolbar', _.bind(this.extendToolbar, this))

  extendMultiCursor: (module) ->
    module.on(module.constructor.events.CURSOR_ADDED, (cursor) ->
      bottomTriangle = cursor.elem.querySelector('.cursor-triangle.bottom')
      topTriangle = cursor.elem.querySelector('.cursor-triangle.top')
      bottomTriangle.style.borderTopColor = topTriangle.style.borderBottomColor = cursor.color
    )

  extendToolbar: (module) ->
    module.container.classList.add('ql-snow')
    _.each(['color', 'background', 'font', 'size', 'align'], (format) =>
      select = module.container.querySelector(".ql-#{format}")
      return unless select?
      switch format
        when 'font', 'size', 'align'
          picker = new Picker(select)
        when 'color', 'background'
          picker = new ColorPicker(select)
          _.each(picker.container.querySelectorAll('.ql-picker-item'), (item, i) ->
            item.classList.add('ql-primary-color') if i < 7
          )
      @pickers.push(picker) if picker?
    )
    _.each(dom(module.container).textNodes(), (node) ->
      node.textContent.trim().length == 0
        dom(node).remove()
    )


module.exports = SnowTheme
